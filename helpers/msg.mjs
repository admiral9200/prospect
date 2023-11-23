export const readConvId = async (ownerId, COOKIE) => {
    const res = await fetch(`https://www.linkedin.com/voyager/api/voyagerMessagingGraphQL/graphql?queryId=messengerConversations.a5975e28c61274a917663e133c323f0f&variables=(mailboxUrn:urn%3Ali%3Afsd_profile%3A${ownerId})`, {
        "headers": {
            "accept": "application/graphql",
            "csrf-token": COOKIE.ajax.replace(/"/g, ''), // Stripping the quotes,
            "cookie": `li_at=${COOKIE.li_at}; JSESSIONID=${COOKIE.ajax};`,
        },
        "body": null,
        "method": "GET"
    });
    const json = await res.json()
    const tokenObj = json?.data?.messengerConversationsBySyncToken?.elements.find(e => e.messages.elements[0].originToken)
    return { ...json, token: tokenObj?.messages?.elements[0]?.originToken }
}

export const sendMsg = async (userId, token, targetId, msg, COOKIE) => {
    // console.log('userId:', userId);
    // console.log('token:', token);
    // console.log('targetId:', targetId);
    // console.log('msg:', msg);
    // console.log('COOKIE:', COOKIE);

    const body = {
        "message": {
            "body": {
                "attributes": [],
                "text": msg
            },
            "originToken": token,
            "renderContentUnions": []
        },
        "mailboxUrn": `urn:li:fsd_profile:${userId}`,
        "trackingId": "¢¯é:ä´@Ê+ÿ0\u0017º\f", // fetch this from conenciton api
        "dedupeByClientGeneratedToken": false,
        "hostRecipientUrns": [
            `urn:li:fsd_profile:${targetId}`
        ]
    }
    let res;
    try {
        res = await fetch("https://www.linkedin.com/voyager/api/voyagerMessagingDashMessengerMessages?action=createMessage", {
            "headers": {
                "accept": "application/json",
                "csrf-token": COOKIE.ajax.replace(/"/g, ''), // Stripping the quotes,
                "cookie": `li_at=${COOKIE.li_at}; JSESSIONID=${COOKIE.ajax};`,
            },
            "body": JSON.stringify(body),
            "method": "POST"
        });
    } catch (error) {
        throw new Error(`Failed to send msg: ${error.message}`);
    }

    if (!res.ok) {
        let errorMessage = '';
        try {
            const errorBody = await res.json();
            errorMessage = errorBody.message || JSON.stringify(errorBody);
        } catch (_) {
            errorMessage = await res.text();
        }
        throw new Error(`Failed to send message. Response status: ${res.status}, statusText: ${res.statusText}, message: ${errorMessage}`);
    }


    let json;
    try {
        json = await res.json();
    } catch (error) {
        throw new Error(`Failed to parse response body: ${error.message}`);
    }

    return { ...json, msg_sent: true }
}

export const readLastMsg = async (convId, msgId, COOKIE) => {
    try {
        const encoded_url = encodeURIComponent(convId).replace(')', "%29").replace("(", "%28")
        const res = await fetch(`https://www.linkedin.com/voyager/api/voyagerMessagingGraphQL/graphql?queryId=messengerMessages.8d15783c080e392b337ba57fc576ad21&variables=(conversationUrn:${encoded_url})`, {
            "headers": {
                "accept": "application/graphql",
                "csrf-token": COOKIE.ajax.replace(/"/g, ''), // Stripping the quotes,
                "cookie": `li_at=${COOKIE.li_at}; JSESSIONID=${COOKIE.ajax};`,
            },
            "body": null,
            "method": "GET"
        });

        if (!res.ok) throw new Error(`Cannot read msg ${res.status}`)

        const json = await res.json()
        const elements = json.data.messengerMessagesBySyncToken.elements

        const systemMsgIndex = elements.findIndex(e => e.entityUrn == msgId)
        // console.log(elements[systemMsgIndex]);
        // const msgs = systemMsgIndex > 0 ? json.data.messengerMessagesBySyncToken.elements.map(e => e.body.text)
        // const reply = systemMsgIndex > 0 ? json?.data?.messengerMessagesBySyncToken?.elements[systemMsgIndex - 1]?.body?.text ? true : false : false
        // return reply
        return systemMsgIndex > 0 || elements[systemMsgIndex].reactionSummaries.length > 0
    } catch (error) {
        throw new Error(`Cannot read msg ${error.message}`)
    }
}

export const seenLastMsg = async (convId, msgId, COOKIE) => {
    try {
        const encoded_url = encodeURIComponent(convId).replace(')', "%29").replace("(", "%28")
        const extractedId = convId.split('-')[1]

        const res = await fetch(`https://www.linkedin.com/voyager/api/voyagerMessagingGraphQL/graphql?queryId=messengerSeenReceipts.15417b08a7230a8c0de682635d1fa848&variables=(conversationUrn:${encoded_url})`, {
            "headers": {
                "accept": "application/graphql",
                "csrf-token": COOKIE.ajax.replace(/"/g, ''), // Stripping the quotes,
                "cookie": `li_at=${COOKIE.li_at}; JSESSIONID=${COOKIE.ajax};`,
            },
            "body": null,
            "method": "GET"
        });
        if (!res.ok) throw new Error(`Cannot see last seen ${res.status}`)
        const json = await res.json()
        const elements = json.data.messengerSeenReceiptsByConversation.elements
        const seenIndex = elements.findIndex(e => e.message.entityUrn.includes(msgId))
        return seenIndex > -1 ? true : false
    } catch (error) {
        throw new Error(`Cannot see last seen ${error.message}`)
    }
}

export const readSingleConv = async (ownerId, kw, targetId, COOKIE) => {
    const res = await fetch(`https://www.linkedin.com/voyager/api/voyagerMessagingGraphQL/graphql?queryId=messengerConversations.c973ec42724936adae62cf01ebae6c47&variables=(categories:List(INBOX,SPAM,ARCHIVE),count:20,firstDegreeConnections:false,mailboxUrn:urn%3Ali%3Afsd_profile%3A${ownerId},keywords:${encodeURIComponent(kw)})`, {
        "headers": {
            "accept": "application/graphql",
            "csrf-token": COOKIE.ajax.replace(/"/g, ''), // Stripping the quotes,
            "cookie": `li_at=${COOKIE.li_at}; JSESSIONID=${COOKIE.ajax};`,
        },
        "body": null,
        "method": "GET"
    });
    const json = await res.json()
    const id = json.data.messengerConversationsBySearchCriteria?.elements.find((elem) => elem.conversationParticipants.find((e) => e.participantType.member.profileUrl == `https://www.linkedin.com/in/${targetId}`))
    return id
}