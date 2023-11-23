import { extractPostsForLikeNComment, fetchPosts } from "./get_posts.mjs"
import { sendLike } from "./like.mjs"
import { postComment as comment } from "./comment.mjs"
import { generateComment } from "./generateComment.mjs"
import { extractProfileInfo, fetchProfileInfo } from "./get_profile.mjs"

const extractUsername = (url) => {
    const regex = /\/in\/([^/]+)\/?$/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

export const scrapeProfile = async (url, cookie) => {
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

    const postsJson = await fetchPosts(extractedProfileInfo, cookie)
    const extractedProfileandPosts = extractPostsForLikeNComment(extractedProfileInfo, postsJson)

    const lastPost = extractedProfileandPosts[0]
    return lastPost
}


export const postLike = async (url, cookie) => {
    const lastPost = await scrapeProfile(url, cookie)

    const isSentLike = sendLike(lastPost.senderId, cookie)
    return isSentLike
}

export const postComment = async (url, cookie) => {
    const lastPost = await scrapeProfile(url, cookie)
    const text = await generateComment(lastPost.postText)

    const postedComment = comment(lastPost.senderId, text, cookie)
    return postedComment
}

