export const postComment = async (postId, text, cookie) => {
    try {
        if (!postId || !text || !cookie) throw new Error('postId, text, cookie cannot be emtpy')
        const body = {
            commentary: {
                text: text,
                attributesV2: [],
                '$type': 'com.linkedin.voyager.dash.common.text.TextViewModel'
            },
            threadUrn: postId
        }
        const res = await fetch("https://www.linkedin.com/voyager/api/voyagerSocialDashNormComments?decorationId=com.linkedin.voyager.dash.deco.social.NormComment-40", {
            "headers": {
                "accept": "application/vnd.linkedin.normalized+json+2.1",
                "content-type": "application/json; charset=UTF-8",
                "csrf-token": cookie.ajax.replace(/"/g, ""), // Stripping the quotes,
                "cookie": `li_at=${cookie.li_at}; JSESSIONID=${cookie.ajax};`,
            },
            "body": JSON.stringify(body),
            "method": "POST"
        });
        if (res.ok) throw new Error("Couldn't post")
        const json = await res.json()
        return json
    } catch (error) {
        console.log(error);
    }
}

const fetchCommentedUsers = async (urlData, cookie, next = 0) => {
    try {
        const start = next ?? 0
        const { postType, postId } = urlData
        // console.log(start);

        const activityPost = `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(count:100,numReplies:1,socialDetailUrn:urn%3Ali%3Afsd_socialDetail%3A%28urn%3Ali%3Aactivity%3A${postId}%2Curn%3Ali%3Aactivity%3A${postId}%2Curn%3Ali%3AhighlightedReply%3A-%29,sortOrder:RELEVANCE,start:${start})&&queryId=voyagerSocialDashComments.280c3235b7ae477a5dba3e946606ce99`

        const ugcPost = `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(count:100,numReplies:1,socialDetailUrn:urn%3Ali%3Afsd_socialDetail%3A%28urn%3Ali%3AugcPost%3A${postId}%2Curn%3Ali%3AugcPost%3A${postId}%2Curn%3Ali%3AhighlightedReply%3A-%29,sortOrder:RELEVANCE,start:${start})&&queryId=voyagerSocialDashComments.280c3235b7ae477a5dba3e946606ce99`

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
        if (!res.ok) throw new Error(`Cannot fetch commented users data status: ${res.status}`)

        const json = await res.json()

        if (json.included.length < 1) throw new Error('Cannot extract commented users from empty arr')
        // console.log(json.data.errors);
        // fs.writeFileSync('comments.json', JSON.stringify(json))
        const usersData = extractCommentedUsers(json)
        const scrappedData = {
            users: usersData,
            paging: json.data.data.socialDashCommentsBySocialDetail.paging,
            apiUrl: url,
        }
        // console.log(scrappedData);
        return scrappedData
    } catch (error) {
        console.log(error);
        throw error
    }

}

const extractCommentedUsers = (json) => {
    const ppls = json.included.filter(obj => obj.commenter && obj.commenter.commenterProfileId && !obj.commenter.author)
    // console.log(ppls);

    const data = (ppls || []).map(ppl => ({
        id: ppl.commenter.commenterProfileId,
        fullName: ppl.commenter.title.text,
        url: ppl.commenter.navigationUrl,
        isAuthor: ppl.commenter.author
    }))
    // console.log(data);
    // console.log(data.length);
    return data
}

export const fetchAllCommentsData = async (urlData, cookie) => {
    const data = await fetchCommentedUsers(urlData, cookie)
    let totalResult = data.paging.total
    // scrappedData.push(data)
    console.log('total comments', totalResult);


    const runNextStepfetchCommentedUsers = async () => {
        const nextStep = data.paging.start + 100
        if (nextStep <= totalResult && nextStep <= 2900) {
            const d = await fetchCommentedUsers(urlData, cookie, nextStep)
            console.log(d.users.length, 'comment');
            data.users.push(...d.users)
            data.paging = d.paging
            await runNextStepfetchCommentedUsers()
        }
    }
    await runNextStepfetchCommentedUsers()
    return data
}