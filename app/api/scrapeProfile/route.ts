import { NextResponse, NextRequest } from 'next/server';
import { scrapProfile } from '@/helpers/scrape_profile.mjs'
import { extractProfileUrl, fetchProfileInfo } from '@/helpers/get_profile.mjs';

export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const body = await req.json();
        const profileId = body.profileId // array of profile urls
        const cookie = {
            li_at: "AQEDAUVcot0A6hEHAAABiZTqmqMAAAGJuPceo00AYzCIcu-LapzlvM-ro1R9FOmD2sZpEi8FSJTVm5MS1bcCypzbmyngYAALfZymyNv7a68n9dqghbN4ZQL68k3nb391th1PmHXPNsjSYh62NpVI-cuj",
            ajax: "ajax:8943248066430222164",
          }; // cookie will come from database either body
        // console.log(JSON.stringify(body, null, 2));
        // console.log(profileId);
        // console.log(cookie);

        //   body_format : {
        //     "profileId": string, or "url": string,
        //     "cookie": {
        //         "li_at": "LI_AT_COOKIE",
        //         "ajax": "JSSESSION_ID"
        //     }
        // } 

        let profile_url = body.url ?? ''

        if (body.profileId) {
            const json = await fetchProfileInfo(profileId, cookie)
            profile_url = await extractProfileUrl(json)
        }

        const scrapped_data = await scrapProfile(profile_url, cookie)
        // console.log(scrapped_data)
        return NextResponse.json({ message: "profile scrapped successfully", data: scrapped_data }, {
            status: 200
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, {
            status: 500
        });
    }
};
