import { extractPostId } from './post.mjs'
import { fetchAllLikeData } from './like.mjs'
import { fetchAllCommentsData } from './comment.mjs'

export const extractCommentsandLikesUsers = async (url, cookie) => {
    const urlData = await extractPostId(url, cookie)
    const likesData = await fetchAllLikeData(urlData, cookie)
    const commentsData = await fetchAllCommentsData(urlData, cookie)
    const users = [...likesData.users, ...commentsData.users]
    const uniqUsers = new Map(users.map(u => [u.id, u]))
    const scrappedData = {
        users: [...uniqUsers.values()],
        likeUrlData: {
            paging: likesData.paging,
            apiUrl: likesData.apiUrl
        },
        commentUrlData: {
            paging: commentsData.paging,
            apiUrl: commentsData.apiUrl
        },
        hitUrl: url
    }
    return scrappedData
}

export const extractOnlyLikesUsers = async (url, cookie) => {
    const urlData = await extractPostId(url, cookie)
    const likesData = await fetchAllLikeData(urlData, cookie)
    const users = likesData.users
    const uniqUsers = new Map(users.map(u => [u.id, u]))
    const scrappedData = {
        users: [...uniqUsers.values()],
        likeUrlData: {
            paging: likesData.paging,
            apiUrl: likesData.apiUrl
        },
        hitUrl: url
    }
    return scrappedData
}

export const extractOnlyCommentsUsers = async (url, cookie) => {
    const urlData = await extractPostId(url, cookie)
    const commentsData = await fetchAllCommentsData(urlData, cookie)
    const users = commentsData.users
    const uniqUsers = new Map(users.map(u => [u.id, u]))
    const scrappedData = {
        users: [...uniqUsers.values()],
        commentUrlData: {
            paging: commentsData.paging,
            apiUrl: commentsData.apiUrl
        },
        hitUrl: url
    }
    return scrappedData
}