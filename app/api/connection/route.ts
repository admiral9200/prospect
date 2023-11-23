import { NextResponse, NextRequest } from 'next/server';
import { scrapProfile } from '@/helpers/scrape_profile.mjs'
import { sendConnectionReq, fetchDescription } from '@/helpers/connection.mjs'


export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const body = await req.json();
        const cookie = body.cookie // cookie will come from database either body
        // console.log(JSON.stringify(body, null, 2));
        // console.log(profiles_urls);
        // console.log(cookie);

        //   body_format : {
        //     "profiles_urls": ['arr of urls'],
        //     "cookie": {
        //         "li_at": "LI_AT_COOKIE",
        //         "ajax": "JSSESSION_ID"
        //     }
        // } 

        const targetId = body.targetId ?? "targeted user's id"

        const connection = await fetchDescription(targetId, cookie) // targetId
        if (connection!.first_degree_connection) {
            throw new Error('Target user is already 1st degree connection')
        }
        const json = await sendConnectionReq(targetId, cookie)
        return NextResponse.json({ messege: "message sent sucessfully", json });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error });
    }
};
