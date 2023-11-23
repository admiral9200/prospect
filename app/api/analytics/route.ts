import { NextRequest, NextResponse } from 'next/server'
import supabaseClient from '@/utils/supabase-client';
import { readLastMsg, seenLastMsg } from '@/helpers/msg.mjs'
import { update } from '@/helpers/supabase-utils.mjs';

export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const { campaignIds } = await req.json()  // Accept an array of campaign IDs
        console.log(campaignIds);


        let { data: campaigns, error: campaignsError } = await supabaseClient
            .from('campaigns')
            .select('*')
            .in('campaign_id', campaignIds);  // Fetch multiple campaigns

        if (campaignsError) {
            console.log('Failed fetching campaigns for analytics:', campaignsError.message);
            throw new Error(`Failed fetching campaigns for analytics ${campaignsError.message}`)
        }

        for (const campaign of campaigns as any[]) {
            const initialProcessedUrls: any = campaign.processed_urls || []

            const processedUrls: any = []
            const analytics = {
                num_of_replies: 0,
                num_of_seen: 0,
                num_of_sent: 0
            }

            const cookie = {
                li_at: campaign.li_at,
                ajax: campaign.jsessionid
            }

            for (const initialProcessedUrl of initialProcessedUrls) {
                if (
                    initialProcessedUrl.msg_sent &&
                    initialProcessedUrl.msgId &&
                    initialProcessedUrl.convId &&
                    !initialProcessedUrl.msg_replied &&
                    !initialProcessedUrl.sent_msg_with_conn
                ) {

                    try {
                        const convId = initialProcessedUrl.convId
                        const msgId = initialProcessedUrl.msgId
                        if (!convId || !msgId) throw new Error("convId or msgId cannot be empty or null ")

                        const seen = initialProcessedUrl.msg_seen ?? await seenLastMsg(convId, msgId, cookie)

                        const targetUserReplied = await readLastMsg(convId, msgId, cookie)

                        analytics.num_of_seen += targetUserReplied ? 1 : seen ? 1 : 0
                        analytics.num_of_replies += targetUserReplied ? 1 : 0
                        analytics.num_of_sent += initialProcessedUrl.msg_sent ? 1 : 0

                        processedUrls.push({ ...initialProcessedUrl, msg_replied: targetUserReplied, msg_seen: seen })
                        // console.log(processedUrls);

                    } catch (error) {
                        console.log("analytics last msg read/seen error " + error);
                    }
                } else {
                    processedUrls.push(initialProcessedUrl)
                }
            }
            // console.log(processedUrls);

            // console.log(processedUrls);
            // await update(campaign.campaign_id, { processed_urls: processedUrls, analytics: analytics }, 'analytics')
            await update(campaign.campaign_id, { analytics: analytics, processed_urls: processedUrls }, 'analytics')
        }

        return NextResponse.json({ message: "Analytics updated successfully" }, {
            status: 200
        })


    } catch (error: any) {
        console.log(error);

        return NextResponse.json({ message: `Something went wrong ${error.message}` }, {
            status: 500
        })
    }
}
