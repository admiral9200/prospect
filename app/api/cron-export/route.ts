import { NextResponse, NextRequest } from 'next/server';
import supabaseClient from '@/utils/supabase-client'; // Added import for Supabase client

export const dynamic = "force-dynamic"

export const GET = async (req: NextRequest, res: NextResponse) => {
    try {
        // Fetch campaign ids from database where campaign_running is set to true
        let { data: campaigns, error } = await supabaseClient
            .from('csv_campaigns')
            .select('campaign_id, last_time_run')
            .eq('campaign_running', true);

        if (error) {
            throw new Error(`Error fetching campaigns: ${error.message}`);
        }
        // console.log(campaigns, 'campaigns from export campaign');

        const apiUrl = 'https://prosp.ai/api/export-campaigns'
        // const apiUrl = 'http://localhost:3000/api/export-campaigns'

        let campaignsData: any[] = campaigns!.map(c => ({ ...c, last_time_run: new Date(c.last_time_run) }))
        const oldestItem = campaignsData.sort((a, b) => a.last_time_run - b.last_time_run)[0]
        const currTime = new Date().getTime()
        const fiveMinAgo = currTime - 5 * 60 * 1000
        const isFiveMinAgoItem = new Date(oldestItem.last_time_run).getTime() <= fiveMinAgo
        // console.log(isFiveMinAgoItem);
        // console.log(oldestItem);
        if (isFiveMinAgoItem) {
            console.log(oldestItem);
            await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ campaignId: [oldestItem.campaign_id] }),
            });
            return NextResponse.json({ message: oldestItem }, {
                status: 200
            });
        } else {
            console.log('no Item is Found');
            return NextResponse.json({ message: 'no Item is Found' }, {
                status: 200
            });
        }
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ message: error.message }, {
            status: 500
        });
    }
};
