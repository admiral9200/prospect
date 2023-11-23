import { NextResponse, NextRequest } from 'next/server';
import supabaseClient from '@/utils/supabase-client'; // Added import for Supabase client

export const dynamic = "force-dynamic"

export const GET = async (req: NextRequest, res: NextResponse) => {
    try {
        // Fetch campaign ids from database where campaign_running is set to true
        const { data: campaigns, error } = await supabaseClient
            .from('campaigns')
            .select('campaign_id, last_time_run')
            .eq('campaign_running', true);

        if (error) {
            throw new Error(`Error fetching campaigns: ${error.message}`);
        }

        const apiUrl = 'https://prosp.ai/api/campaigns'
        // const apiUrl = 'http://localhost:3000/api/campaigns'

        let campaignsData: any[] = campaigns!.map(c => ({ ...c, last_time_run: new Date(c.last_time_run) }))
        const oldestItem = campaignsData.sort((a, b) => a.last_time_run - b.last_time_run)[0]
        const currTime = new Date().getTime()
        const sevenHoursAgo = currTime - 7 * 60 * 60 * 1000
        const isSevenHoursAgoItem = new Date(oldestItem.last_time_run).getTime() <= sevenHoursAgo
        // console.log(isSevenHoursAgoItem);
        // console.log(oldestItem);
        if (isSevenHoursAgoItem) {
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
