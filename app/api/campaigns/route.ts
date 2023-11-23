import { NextRequest, NextResponse } from "next/server"
import { fetchDescription } from '@/helpers/connection.mjs'
import { scrapProfile } from '@/helpers/scrape_profile.mjs'
import { one_month_past } from '@/helpers/utils.mjs'
import generateMsg from '@/helpers/generateMsg.mjs'
import supabaseClient from '@/utils/supabase-client'; // Added import for Supabase client
import { handle_msg, handle_connection, search_url } from '@/helpers/campaigns-utils.mjs'
import { update } from '@/helpers/supabase-utils.mjs'

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))


export const POST = async (req: NextRequest, res: NextResponse) => {
    let campaignIdForCatch = '';

    try {
        // Fetching campaign data directly from the database
        const body = await req.json()
        const campaignId = body.campaignId

        let { data: campaigns, error: campaignsError } = await supabaseClient
            .from('campaigns')
            .select('*')
            .in('campaign_id', campaignId); // []

        if (campaignsError) {
            console.log('Error fetching running campaigns:', campaignsError.message);
            throw new Error(`Error fetching running campaigns: ${campaignsError.message}`);
        }
        if (!campaigns) return
        let uniqueUrls: string[] = [];
        for (const campaign of campaigns) {
            campaignIdForCatch = campaign.campaign_id
            const cookie = {
                li_at: campaign.li_at,
                ajax: campaign.jsessionid,
                li_a: campaign.li_a,
                liap: campaign.liap
            }

            if (!campaign.is_single_profile && campaign.total_search_results && campaign.total_search_results > campaign.start) { // Checking if 'total_search_results' exists before proceeding
                try {
                    const { data, urls } = await search_url(campaign.linkedin_search_url, campaign.start, cookie)

                    // Filter out URLs that already exist in linkedin_profiles_url
                    uniqueUrls = urls.filter(url => !campaign.linkedin_profiles_url.includes(url));
                    // console.log(uniqueUrls);
                    // console.log(urls);

                    const start = data.start // 
                    const campaign_running = data.campaign_running // 
                    // console.log(campaign_running);

                    // Use uniqueUrls instead of urls
                    const new_linkedin_profiles_url = [...campaign.linkedin_profiles_url, ...uniqueUrls]
                    await update(campaign.campaign_id, {
                        linkedin_profiles_url: new_linkedin_profiles_url,
                        start: start
                    }, 'campaign linkedin_profiles_url')

                    campaign.linkedin_profiles_url = new_linkedin_profiles_url;
                    // console.log('campaign.linkedin_profiles_url in the first loop:', campaign.linkedin_profiles_url)
                } catch (error: any) {
                    console.log(error);
                    // throw new Error("cannot extrat data from search url");
                    // if couldnt modify the search url set compaign_running = false
                    await update(campaign.campaign_id, { campaign_running: false, error: error.message }, 'campaignRunningError')
                }
            }

            const ownerId = campaign.user_linkedin_id; // Set ownerId from campaign data
            if (!ownerId) {
                console.log('Campaign ownerId not found :', campaign.campaign_id);
                await update(campaign.campaign_id, { campaign_running: false, error: 'Campaign ownerId not found' }, 'campaignOwnerIdError')
                throw new Error(`Campaign ownerId not found : ${campaign.campaign_id}`);
                // Decide what to do if user not found. Continue to next iteration? Throw an error? Return response?
            }

            // We've already fetched the campaign data above, including scrapped_profiles
            let scrapped_profiles: any = campaign.scrapped_profiles || [];
            let scrapped_profiles_error: any = campaign.scrapped_profiles_error || [];

            // Create a new array for the ready profiles, initialized with the database value
            let readyProfiles: any = campaign.ready_profiles || [];
            // console.log('init_readyProfiles', readyProfiles);



            const scrapped_urls = scrapped_profiles.map(profile => profile.url)

            const readyProfilesUrls = readyProfiles.map(profile => profile.url)


            const always_send_message = campaign.always_send_message; // Set always_send_message from database
            const send_msg_with_connection = campaign.send_msg_with_connection; // Set always_send_message from database

            // console.log('waiting_connection', waiting_connection);

            const processed_urls = campaign.processed_urls || []
            const processedUrls = processed_urls.map(profile => profile.url)

            const processedUrlsSet = new Set(processedUrls);

            // Create a Set to store URLs that are in waiting_connection
            let waiting_connection: any = campaign.waiting_connection || [];
            let waiting_connection_error: any = campaign.waiting_connection_error || [];
            const waitingConnectionUrls = waiting_connection.map((profile) => profile.url)
            const waitingConnectionUrlsSet = new Set(waitingConnectionUrls);
            const errWaitingConnectionUrls = waiting_connection_error.map((profile) => profile.url)
            const errWaitingConnectionUrlsSet = new Set(errWaitingConnectionUrls);

            let filtered_linkedin_profiles_url = (campaign.linkedin_profiles_url || []).filter((url: string) => {
                return (
                    !processedUrlsSet.has(url) &&
                    !waitingConnectionUrlsSet.has(url) &&
                    !errWaitingConnectionUrlsSet.has(url) &&
                    !scrapped_urls.includes(url) &&
                    !readyProfilesUrls.includes(url)
                )
            })


            // console.log('filtered:', filtered_linkedin_profiles_url);


            // Determine the number of iterations, which will be 10 or less
            const iteration = Math.min(filtered_linkedin_profiles_url.length, 3)

            const newProcessedUrl: any = []
            const errScrapedProfileUrls: any = []

            // console.log("processedUrls:", processedUrls);
            // console.log("scrapped_profiles before processing:", scrapped_profiles);
            // console.log("filtered_linkedin_profiles_url before processing:", filtered_linkedin_profiles_url);


            // Changed forEach loop to Promise.all for concurrent requests
            await Promise.all(
                filtered_linkedin_profiles_url.slice(0, iteration).map(async (url: string) => {
                    try {
                        const scrapped_profile = await scrapProfile(url, cookie)
                        scrapped_profiles.push({
                            url: url,
                            ...scrapped_profile
                        })
                    } catch (error: any) {
                        errScrapedProfileUrls.push({ url, error: error.message })
                    }
                })
            );
            scrapped_profiles_error.push(...errScrapedProfileUrls)
            // console.log("filtered_linkedin_profiles_url after processing:", filtered_linkedin_profiles_url);


            // Generate responses for the scrapped profiles
            const newScrappedProfiles = scrapped_profiles.filter(profile => !readyProfiles.find(readyProfile => readyProfile.url === profile.url));
            // console.log('newScrappedProfiles', newScrappedProfiles);


            // Filter out URLs that are already processed
            const filteredReadyProfiles = newScrappedProfiles.filter(profile => !processedUrlsSet.has(profile.url));
            // console.log('filteredReadyProfiles', filteredReadyProfiles);

            const postData = await generateMsg(campaign.campaign_id, filteredReadyProfiles.slice(0, 3));
            // console.log(postData);

            if (postData.error) {
                console.error('Error:', postData.error);
                throw new Error(`generateMsg: ${postData.error}`);
            }

            // Update readyProfiles to only include profiles already in the database
            // and profiles returned by the POST API
            const existingProfiles = new Map(readyProfiles.map(profile => [profile.url, profile]));
            const newReadyProfiles: any = []
            // console.log(existingProfiles);

            // Add a check for 'postData.responses' before proceeding
            // console.log('this is postData.responses: ', postData.responses)
            if (postData.responses) {

                postData.responses.forEach(profile => {
                    if (profile.response) {
                        if (!existingProfiles.has(profile.url)) {
                            newReadyProfiles.push(profile)
                        }
                        existingProfiles.set(profile.url, profile)
                    }
                });
                readyProfiles = Array.from(existingProfiles.values());
            }
            await update(campaign.campaign_id, {
                ready_profiles: readyProfiles,
            }, 'readyProfiles')

            // console.log("readyProfiles after promise", readyProfiles);
            // console.log(existingProfiles);

            // console.log("scrapped_profiles after promise", scrapped_profiles)
            // Updating scrapped_profiles in the database
            // console.log('scrapped_profiles', scrapped_profiles);

            let obj = {}
            for (let sp of scrapped_profiles) {
                obj[sp.id] = sp
            }
            scrapped_profiles = Object.values(obj)
            // console.log('scrapped_profiles', scrapped_profiles);

            await update(campaign.campaign_id, {
                scrapped_profiles: scrapped_profiles,
                scrapped_profiles_error: scrapped_profiles_error
            }, 'scrapped_profiles')

            // Fetch the user's LinkedIn ID directly from the campaign data

            let message_error: any = campaign.message_error || []
            let messageErrUrls: any = (campaign.message_error || []).map(p => p.url)
            let waiting_error: any = []

            // const waiting_connection_urls = waiting_connection.map(p => p.url)
            console.log(newReadyProfiles, 'newReadyProfiles');

            for (const profile of newReadyProfiles) {
                if (
                    errWaitingConnectionUrls.includes(profile.url) ||
                    processedUrls.includes(profile.url) ||
                    waitingConnectionUrls.includes(profile.url) ||
                    (messageErrUrls.includes(profile.url) && !always_send_message)
                ) continue

                const last_time_run = new Date()

                try {
                    // console.log("profile in profile of readyProfiles: ", profile)
                    // console.log('profile', profile);
                    console.log('new.profile.url', profile.url);
                    const connection = await fetchDescription(profile.id, cookie) // targetId

                    if (connection!.first_degree_connection) {
                        const data = await handle_msg(
                            profile,
                            ownerId,
                            cookie,
                            always_send_message,
                            newProcessedUrl,
                            message_error,
                            waiting_connection)

                        waiting_connection = data?.filtered_waiting_connection

                        message_error = data?.filtered_message_error
                        const newProcessedUrls = [...processed_urls, ...newProcessedUrl]
                        existingProfiles.set(profile.url, { ...profile, last_time_run })
                        readyProfiles = Array.from(existingProfiles.values());
                        await update(campaign.campaign_id, {
                            waiting_connection: waiting_connection,
                            message_error: message_error,
                            processed_urls: newProcessedUrls,
                            ready_profiles: readyProfiles
                        }, 'msg_sent')
                        continue
                    }


                    if (waitingConnectionUrls.includes(profile.url)) continue

                    await handle_connection(
                        profile,
                        cookie,
                        waiting_connection,
                        waiting_connection_error,
                        send_msg_with_connection,
                        newProcessedUrl)

                    const newProcessedUrls = [...processed_urls, ...newProcessedUrl]
                    existingProfiles.set(profile.url, { ...profile, last_time_run })
                    readyProfiles = Array.from(existingProfiles.values());
                    await update(campaign.campaign_id,
                        {
                            waiting_connection: waiting_connection,
                            waiting_connection_error: waiting_connection_error,
                            processed_urls: newProcessedUrls,
                            ready_profiles: readyProfiles
                        },
                        'waiting_connection')

                } catch (error: any) {
                    console.log("profile " + JSON.stringify(profile), "Error " + error);
                    // throw new Error(`readyProfiles: ${JSON.stringify(profile)}, Error: ${error.message}`);
                    // message_error.push({ ...profile, always_send_error: false, error: error.message, msg_sent: false })
                }
            }

            let readyProfilesMap: any[] = readyProfiles!.map(p => ({ ...p, last_time_run: new Date(p.last_time_run ?? null) }))
            const oldestThreeReadyProfiles = readyProfilesMap.sort((a, b) => a.last_time_run - b.last_time_run).slice(0, 3)
            console.log(oldestThreeReadyProfiles, 'oldestThreeReadyProfiles');

            for (const profile of oldestThreeReadyProfiles) {
                if (
                    errWaitingConnectionUrls.includes(profile.url) ||
                    processedUrls.includes(profile.url) ||
                    (messageErrUrls.includes(profile.url) && !always_send_message)
                ) continue

                const last_time_run = new Date()

                try {
                    console.log('oldest.profile.url', profile.url);
                    const connection = await fetchDescription(profile.id, cookie) // targetId

                    if (connection!.first_degree_connection) {
                        const data = await handle_msg(
                            profile,
                            ownerId,
                            cookie,
                            always_send_message,
                            newProcessedUrl,
                            message_error,
                            waiting_connection)

                        waiting_connection = data?.filtered_waiting_connection

                        message_error = data?.filtered_message_error
                        const newProcessedUrls = [...processed_urls, ...newProcessedUrl]
                        existingProfiles.set(profile.url, { ...profile, last_time_run })
                        readyProfiles = Array.from(existingProfiles.values());
                        await update(campaign.campaign_id, {
                            waiting_connection: waiting_connection,
                            message_error: message_error,
                            processed_urls: newProcessedUrls,
                            ready_profiles: readyProfiles
                        }, 'msg_sent')
                        continue
                    }

                    if (waitingConnectionUrls.includes(profile.url)) continue

                    await handle_connection(
                        profile,
                        cookie,
                        waiting_connection,
                        waiting_connection_error,
                        send_msg_with_connection,
                        newProcessedUrl)

                    const newProcessedUrls = [...processed_urls, ...newProcessedUrl]
                    existingProfiles.set(profile.url, { ...profile, last_time_run })
                    readyProfiles = Array.from(existingProfiles.values());
                    await update(campaign.campaign_id,
                        {
                            waiting_connection: waiting_connection,
                            waiting_connection_error: waiting_connection_error,
                            processed_urls: newProcessedUrls,
                            ready_profiles: readyProfiles
                        },
                        'waiting_connection')

                } catch (error: any) {
                    console.log("profile " + JSON.stringify(profile), "Error " + error);
                    // throw new Error(`readyProfiles: ${JSON.stringify(profile)}, Error: ${error.message}`);
                    // message_error.push({ ...profile, always_send_error: false, error: error.message, msg_sent: false })
                }
            }

            // console.log(waiting_connection);
            const moved_processed_data: any = []

            for (const profile of waiting_connection) {
                if (!profile.req_sent) continue
                const isPast = !one_month_past(profile)
                if (isPast) {
                    moved_processed_data.push({ ...profile, msg_sent: false, error: 'One month has been past', one_month_past: true })
                }
            }

            const filtered_waiting_connection = waiting_connection.filter(p => one_month_past(p))

            // console.log(newProcessedUrl);

            // Updating waiting_connection in the database
            const newProcessedUrls = [...processed_urls, ...newProcessedUrl, ...moved_processed_data]
            if (moved_processed_data.length > 0 || filtered_waiting_connection.length > 0) {
                await update(campaign.campaign_id, {
                    waiting_connection: waiting_connection,
                    processed_urls: newProcessedUrls
                }, 'filtering_waiting_connection')
            }


            // Update campaign_running based on the newProcessedUrls length and campaign.linkedin_profiles_url length
            let campaign_running;
            const processedUrlsLength = newProcessedUrls.length + scrapped_profiles_error.length;
            const updatedLinkedinProfilesLength = campaign.linkedin_profiles_url.length + uniqueUrls.length
            campaign_running = processedUrlsLength >= updatedLinkedinProfilesLength ? false : true;

            await update(campaign.campaign_id, {
                campaign_running: campaign_running,
                last_time_run: new Date()
            }, 'campaignRunning')
        }


        return NextResponse.json({ message: "campaigns completed successfully" })
    } catch (error: any) {
        console.log('main catch', error);
        // await update(campaignIdForCatch, {
        //     campaign_running: false,
        //     last_time_run: new Date(),
        //     error: error.message
        // }, 'campaignRunning')
        return NextResponse.json({ message: error.message }, {
            status: 500
        })
    }
}