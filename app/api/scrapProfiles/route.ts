import { NextResponse, NextRequest } from 'next/server';
import { scrapProfile } from '@/helpers/scrape_profile.mjs'

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const body = await req.json();
    const profiles_urls = body.profiles_urls // array of profile urls
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

    let data: any = [];

    // // Loop over the profiles
    for (let profile_url of profiles_urls) {
      const json = await scrapProfile(profile_url, cookie)
      data.push(json)
    }
    // console.log(response)
    return NextResponse.json({ message: "profile scrapped successfully", data }, {
      status: 200
    });
  } catch (error: any) {
    // console.log(error.message);
    return NextResponse.json({ message: error.message }, {
      status: 500
    });
  }
};
