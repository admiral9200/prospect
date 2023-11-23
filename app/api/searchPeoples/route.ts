import { NextRequest, NextResponse } from "next/server";
import { handle_linkedin_search_url, handle_sales_search_url } from '@/helpers/handle_search_urls.mjs'

export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const body = await req.json()
        // console.log(JSON.stringify(body, null, 2));
        const url = body.url
        const cookie = body.cookie // cookie will come from database
        // console.log(url);

        //   body_format : {
        //     "url": "search_url",
        //     "cookie": {
        //         "li_at": "LI_AT_COOKIE",
        //         "ajax": "JSSESSION_ID"
        //     }
        // } 

        const data = url.startsWith('https://www.linkedin.com/sales/search/people') ?
            await handle_sales_search_url(url, cookie)
            :
            await handle_linkedin_search_url(url, cookie)
        // data.total_search_results
        // save data base
        // structure may change in future according to need

        return NextResponse.json({ message: "sucessfully fetched peoples data", data }, {
            status: 200
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "failed to fetched peoples data" }, {
            status: 500
        })
    }
}