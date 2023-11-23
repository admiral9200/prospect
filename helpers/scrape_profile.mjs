import { fetchDescription } from "./connection.mjs";
import { extractPosts, fetchPosts } from "./get_posts.mjs"
import {
    extractProfileBio,
    extractProfileEmail,
    extractProfileInfo,
    fetchProfileBio,
    fetchProfileEmail,
    fetchProfileInfo,
    fetchimageUrl
} from "./get_profile.mjs"

const extractUsername = (url) => {
    const regex = /\/in\/([^/]+)\/?$/;
    const match = url.match(regex);
    return match ? match[1] : null;
}


export const scrapProfile = async (url, cookie) => {
    const username = extractUsername(url)
    if (!username) {
        throw new Error(`
        Couldn't extarct username
        please provide url in below format
        https://www.linkedin.com/in/your-username/
        or
        https://www.linkedin.com/in/your-username
        `)
    }

    const profileJson = await fetchProfileInfo(username, cookie)
    const extractedProfileInfo = await extractProfileInfo(profileJson, username)
    // console.log(extractedProfileInfo);

    const bioJson = await fetchProfileBio(extractedProfileInfo, cookie)
    const extractedProfileWithBio = await extractProfileBio(extractedProfileInfo, bioJson)

    const emailJson = await fetchProfileEmail(extractedProfileInfo, cookie)
    const extractedProfileWithEmail = extractProfileEmail(extractedProfileWithBio, emailJson)

    const extractedProfileWithImageUrl = await fetchimageUrl(extractedProfileWithEmail, cookie)

    // const description = await fetchDescription(extractedProfileInfo.id, cookie)
    // const extractedProfileWithDesc = { ...extractedProfileWithImageUrl, ...description }

    const postsJson = await fetchPosts(extractedProfileInfo, cookie)
    const extractedProfileandPosts = extractPosts(extractedProfileWithImageUrl, postsJson)

    return extractedProfileandPosts
}

