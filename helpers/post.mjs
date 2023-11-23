import * as cheerio from 'cheerio';

export const extractPostId = async (url, cookie) => {
    const res = await fetch(url, {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "cookie": `JSESSIONID =\"${cookie.ajax}\";li_at=${cookie.li_at};`,
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET"
    });
    if (!res.ok) throw new Error(`Cannot fetch post id status: ${res.status}`)
    const text = await res.text()
    // console.log(text);
    return extractPostIdfromHTML(text)
}

const extractPostIdfromHTML = (html) => {
    const $ = cheerio.load(html);
    let urlData;

    $('code').each((index, element) => {
        const codeContent = $(element).text();

        if (codeContent.includes('urn:li:fsd_comment:') || codeContent.includes('urn:li:activity:')) {
            const match = codeContent.match(/urn:li:(fsd_comment|activity):(\([^,]+),urn:li:(ugcPost|activity):([^)]+)\)/);

            if (!match) return
            // console.log(match);
            const commentId = match[2].replace('(', '');
            const postType = match[3];
            const postId = match[4];
            // Do something with commentID and postID here
            // console.log('Comment ID:', commentID);
            // console.log('Post Type:', postType);
            // console.log('Post ID:', postID);
            urlData = {
                commentId, postType, postId
            }

        }

    });
    if (!urlData) throw new Error("Unable to extract post id")
    return urlData
}
