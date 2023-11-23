import { NextRequest, NextResponse } from "next/server";
import { extractOnlyLikesUsers } from '@/helpers/scrapeLikeorCommentUsers.mjs'

export async function POST(req: NextRequest) {
    try {
        const { url, cookie } = await req.json()
        if (!url || !cookie) throw new Error("url or cookie is missing");

        const data = await extractOnlyLikesUsers(url, cookie)

        return NextResponse.json({
            message: `${data.users.length} liked users scrapped sucessfully`,
            data: data
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, {
            status: 500
        })
    }
}