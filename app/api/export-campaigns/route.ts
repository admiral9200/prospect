import { NextRequest, NextResponse } from "next/server"
import { scrapProfile } from '@/helpers/scrape_profile.mjs'
import generateMsg from '@/helpers/generateMsg.mjs'
import supabaseClient from '@/utils/supabase-client'; // Added import for Supabase client
import { search_url } from '@/helpers/campaigns-utils.mjs'
import { update } from '@/helpers/supabase-utils.mjs'

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const POST = async (req: NextRequest, res: NextResponse) => {

    try {
        const body = await req.json()
        const campaignId = body.campaignId

        let { data: campaigns, error: campaignsError } = await supabaseClient
            .from('csv_campaigns')
            .select('*')
            .in('campaign_id', campaignId); // []

        if (campaignsError) {
            console.log('Error fetching running campaigns:', campaignsError.message);
            throw new Error(`Error fetching running campaigns: ${campaignsError.message}`);
        }
        if (!campaigns) throw new Error("campaigns is cannot be empty");
        let uniqueUrls: string[] = [];
        for (const campaign of campaigns) {
            const cookie = {
                li_at: campaign.li_at,
                ajax: campaign.jsessionid,
                li_a: campaign.li_a,
                liap: campaign.liap
            }

            if (campaign.total_search_results && campaign.total_search_results > campaign.start) { // Checking if 'total_search_results' exists before proceeding
                try {
                    const { data, urls } = await search_url(campaign.linkedin_search_url, campaign.start, cookie)

                    // Filter out URLs that already exist in linkedin_profiles_url
                    uniqueUrls = urls.filter(url => !campaign.linkedin_profiles_url.includes(url));

                    const start = data.start // 
                    const campaign_running = data.campaign_running // 
                    // console.log(campaign_running);

                    // Use uniqueUrls instead of urls
                    const new_linkedin_profiles_url = [...campaign.linkedin_profiles_url, ...uniqueUrls]
                    await update(campaign.campaign_id, {
                        linkedin_profiles_url: new_linkedin_profiles_url,
                        start: start
                    }, 'campaign linkedin_profiles_url', true)

                    campaign.linkedin_profiles_url = new_linkedin_profiles_url;
                    // console.log('campaign.linkedin_profiles_url in the first loop:', campaign.linkedin_profiles_url)
                } catch (error: any) {
                    console.log(error);
                    // throw new Error("cannot extrat data from search url");
                    // if couldnt modify the search url set compaign_running = false
                    await update(campaign.campaign_id, { campaign_running: false, error: error.message }, 'campaignRunningError', true)
                }
            }

            // We've already fetched the campaign data above, including scrapped_profiles
            let scrapped_profiles: any = campaign.scrapped_profiles || [];
            let scrapped_profiles_error: any = campaign.scrapped_profiles_error || [];

            // Create a new array for the ready profiles, initialized with the database value
            let readyProfiles: any = campaign.ready_profiles || [];
            // console.log('init_readyProfiles', readyProfiles);

            const scrapped_urls = scrapped_profiles.map(profile => profile.url)
            const scrapped_error_urls = scrapped_profiles_error.map(profile => profile.url)
            const readyProfilesUrls = readyProfiles.map(profile => profile.url)

            let filtered_linkedin_profiles_url = (campaign.linkedin_profiles_url || []).filter((url: string) => {
                return (
                    !scrapped_urls.includes(url) &&
                    !scrapped_error_urls.includes(url) &&
                    !readyProfilesUrls.includes(url)
                )
            })

            // console.log('filtered:', filtered_linkedin_profiles_url);
            // Determine the number of iterations, which will be 10 or less
            const iteration = Math.min(filtered_linkedin_profiles_url.length, 3)
            const errScrapedProfileUrls: any = []

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
                        // console.log(scrapped_profile,'scrapped_profile');

                    } catch (error: any) {
                        console.log(error, 'scrapped profile error line no 122');
                        errScrapedProfileUrls.push({ url, error: error.message })
                    }
                })
            );
            scrapped_profiles_error.push(...errScrapedProfileUrls)

            // Generate responses for the scrapped profiles
            const newScrappedProfiles = scrapped_profiles.filter(profile => !readyProfiles.find(readyProfile => readyProfile.url === profile.url));

            // console.log(newScrappedProfiles.length, 'newScrappedProfiles before generating msg');

            for (const p of newScrappedProfiles.slice(0, 3)) {
                // console.log(p);
                const res: any = await generateMsg(campaign.campaign_id, [p], true);
                // postData.responses.push(...res.responses)

                const existingProfiles = new Map(readyProfiles.map(profile => [profile.url, profile]));
                // console.log(existingProfiles.size, 'existingProfiles.size');

                // Add a check for 'postData.responses' before proceeding
                // console.log('this is postData.responses: ', postData.responses)
                if (res.responses) {
                    // console.log(res.responses.length, 'responses');

                    res.responses.forEach((profile: any) => {
                        console.log(profile.url, 'before if');

                        if (profile.response) {
                            console.log(profile.url, 'after if');
                            console.log(profile.response);
                            existingProfiles.set(profile.url, profile)
                        }
                    });
                    readyProfiles = Array.from(existingProfiles.values());
                }
                // console.log(existingProfiles.size, 'existingProfiles.size_after ready profile');
                await update(campaign.campaign_id, {
                    ready_profiles: readyProfiles,
                }, 'readyProfiles', true)
                await wait(1000)
            }

            const obj = scrapped_profiles.reduce((acc, sp) => {
                acc[sp.id] = sp
                return acc
            }, {})
            scrapped_profiles = Object.values(obj)
            // console.log('scrapped_profiles', scrapped_profiles);

            // Update campaign_running based on the readyProfiles , scrapped_profiles_error length and campaign.linkedin_profiles_url length
            let campaign_running;
            const readyProfilesLength = readyProfiles.length + scrapped_profiles_error.length
            const updatedLinkedinProfilesLength = [...campaign.linkedin_profiles_url, ...uniqueUrls].length
            campaign_running = readyProfilesLength >= updatedLinkedinProfilesLength ? false : true;

            await update(campaign.campaign_id, {
                scrapped_profiles: scrapped_profiles,
                scrapped_profiles_error: scrapped_profiles_error,
                campaign_running: campaign_running,
                last_time_run: new Date()
            }, 'update_processed_urls', true)
        }

        return NextResponse.json({ message: "campaigns completed successfully" })
    } catch (error: any) {
        console.log('main catch', error);
        return NextResponse.json({ message: error.message }, {
            status: 500
        })
    }
}