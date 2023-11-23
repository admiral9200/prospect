export const sendLike = async (postId, cookie) => {
    try {
        const encodedUri = encodeURIComponent(postId)
        const url = `https://www.linkedin.com/voyager/api/voyagerSocialDashReactions?threadUrn=${encodedUri}`

        const res = await fetch(url, {
            "headers": {
                "accept": "application/vnd.linkedin.normalized+json+2.1",
                "content-type": "application/json; charset=UTF-8",
                "csrf-token": cookie.ajax.replace(/"/g, ""), // Stripping the quotes,
                "cookie": `li_at=${cookie.li_at}; JSESSIONID=${cookie.ajax};`,
            },
            "body": "{\"reactionType\":\"LIKE\"}",
            "method": "POST"
        });
        const isOk = res.ok
        if (!isOk) throw new Error('Couldnt like the post')
        // console.log('post liked', isOk);
        return isOk
    } catch (error) {
        console.log(error);
    }
}


export const fetchLikedUsers = async (urlData, cookie, next = 0) => {
    try {
        const start = next ?? 0
        const { postType, postId } = urlData
        // console.log(start);

        const activityPost = `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(count:100,start:${start},threadUrn:urn%3Ali%3Aactivity%3A${postId})&&queryId=voyagerSocialDashReactions.fa18066ba15b8cf41b203d2c052b2802`

        const ugcPost = `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(count:100,start:${start},threadUrn:urn%3Ali%3AugcPost%3A${postId})&&queryId=voyagerSocialDashReactions.fa18066ba15b8cf41b203d2c052b2802`

        const url = postType === 'ugcPost' ? ugcPost : activityPost

        const res = await fetch(url, {
            "headers": {
                "accept": "application/vnd.linkedin.normalized+json+2.1",
                "csrf-token": cookie.ajax,
                "cookie": `JSESSIONID =\"${cookie.ajax}\";li_at=${cookie.li_at};`,
            },
            "body": null,
            "method": "GET"
        });

        if (!res.ok) throw new Error(`Cannot fetch liked users data status: ${res.status}`)

        const json = await res.json()
        if (json.included.length < 1) throw new Error('Cannot extract likes users from empty arr')

        const usersData = await extractLikedUsers(json)
        const scrappedData = {
            users: usersData,
            paging: json.data.data.socialDashReactionsByReactionType.paging,
            apiUrl: url,
        }
        return scrappedData
    } catch (error) {
        console.log(error);
    }
}


const extractLikedUsers = async (json) => {
    const ppls = json.included.filter(obj => obj.reactorLockup)

    const data = ppls.map(p => ({
        id: p.reactorLockup.navigationUrl.split('/').reverse()[0],
        fullName: p.reactorLockup.title.text,
        url: p.reactorLockup.navigationUrl,
    }))
    // console.log(data);
    // console.log(data.length);
    return data
}


export const fetchAllLikeData = async (urlData, cookie) => {
    const data = await fetchLikedUsers(urlData, cookie)
    let totalResult = data.paging.total
    // scrappedData.push(data)
    console.log('total likes', totalResult);

    const runNextStepfetchLikeUsers = async () => {
        const nextStep = data.paging.start + 100
        if (nextStep <= totalResult && nextStep <= 2900) {
            const d = await fetchLikedUsers(urlData, cookie, nextStep)
            console.log(d.users.length, 'likes');
            data.users.push(...d.users)
            data.paging = d.paging
            await runNextStepfetchLikeUsers()
        }
    }
    await runNextStepfetchLikeUsers()
    // console.log(data.users);
    return data
}
