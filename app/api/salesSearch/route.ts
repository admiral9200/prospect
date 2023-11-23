import { NextRequest, NextResponse } from "next/server";
import { modify_sales_search_url, fetch_search_url, extract_data_search_url } from '@/helpers/sales_search.mjs'

export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const body = await req.json()
        // console.log(JSON.stringify(body, null, 2));
        const url = body.url
        // const cookie = body.cookie // cookie will come from database
        const cookie = {
            ...body.cookie,
            liap: 'true',
            li_a: 'AQJ2PTEmc2FsZXNfY2lkPTEzMzI1MzM5MDclM0ElM0E1NzIyNTc4MDebsG0hHW6g2ZpdbbQ_o4v9DAoz8A'
        } // cookie will come from database

        // console.log(url);

        // const body_format = {
        //     "url": "search_url",
        //     "cookie": {
        //         ajax: 'ajax:ajax',
        //         liap: 'liap',
        //         li_at: 'li_at',
        //         li_a: 'li_a'
        //     }
        // }

        const getUrl = modify_sales_search_url(url)
        const json = await fetch_search_url(getUrl, cookie)
        const data = extract_data_search_url(json)


        // data.total_search_results
        // save data base

        return NextResponse.json({ message: "sucessfully fetched peoples data", data }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({ message: "failed to fetched peoples data" }, {
            status: 500
        })
    }
}