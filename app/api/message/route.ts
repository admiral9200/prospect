import { NextResponse, NextRequest } from 'next/server';
import { scrapProfile } from '@/helpers/scrape_profile.mjs'
import { readConvId, sendMsg } from '@/helpers/msg.mjs'


export const POST = async (req: NextRequest, res: NextResponse) => {
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

    const ownerId = "user's own id" // username // link
    const msg = "Your msg" // comes from database
    const targetId = "targeted user's id" // link of the target user

    const convIds: any = readConvId(ownerId, cookie)
    const token = convIds.data.messengerConversationsBySyncToken.elements[0].messages.elements[0].originToken

    const json = await sendMsg(ownerId, token, targetId, msg, cookie)
    // console.log(response)
    return NextResponse.json({ messege: "message sent sucessfully", json });
};
