import { readConvId, readSingleConv, sendMsg } from './msg.mjs'
import { sendConnectionReq } from './connection.mjs'
import { handle_linkedin_search_url, handle_sales_search_url } from './handle_search_urls.mjs'

export const handle_msg = async (profile, ownerId, cookie, always_send_message, newProcessedUrl, message_error, waiting_connection) => {
    const message_error_urls = (message_error || []).map(m => m.url)
    try {
        const convIds = await readConvId(ownerId, cookie)
        // console.log('convIds', convIds);

        const token = convIds?.token ?? "fd4a4bc3-fddc-447a-88cd-c5acef695a09"
        // console.log('token', token);

        const msg = profile.response
        // console.log("profile.response", profile.response);
        if (always_send_message) { // we need waiting for connection waiting_connection = [] < in database
            const msgJson = await sendMsg(ownerId, token, profile.id, msg, cookie) // send msg anyway or send msg only when conv is empty
            newProcessedUrl.push({ ...profile, msg_sent: msgJson ? msgJson.msg_sent : false, msgId: msgJson?.value?.entityUrn, convId: msgJson?.value?.conversationUrn })
            return {
                filtered_waiting_connection: waiting_connection.filter(p => p.url != profile.url),
                filtered_message_error: message_error.filter(p => p.url != profile.url)
            }
        }
        if (!always_send_message) {
            const id = await readSingleConv(ownerId, profile.fullName, profile.id, cookie)
            // console.log('id', id);

            const msgJson = !id ? await sendMsg(ownerId, token, profile.id, msg, cookie) : null //msg
            if (msgJson && msgJson.msg_sent) {
                // if (!id) {
                // console.log('msg sent');
                newProcessedUrl.push({ ...profile, msg_sent: msgJson.msg_sent, error: "", msgId: msgJson?.value?.entityUrn, convId: msgJson?.value?.conversationUrn })
                return {
                    filtered_waiting_connection: waiting_connection.filter(p => p.url != profile.url),
                    filtered_message_error: message_error
                }
            } else {
                // console.log('msg not sent');
                !message_error_urls.includes(profile.url) && message_error.push({ ...profile, always_send_error: true, msg_sent: false, error: "Conversation is not empty. Toggle 'Always send a message' if you want to send the message regardless of the conversation content. This URL can no longer be processed by this campaign, create another campaign." })
                return {
                    filtered_waiting_connection: waiting_connection.filter(p => p.url != profile.url),
                    filtered_message_error: message_error
                }
            }
        }

    } catch (error) {
        console.log('handle_msg', error);
        return {
            filtered_waiting_connection: waiting_connection,
            filtered_message_error: message_error
        }
        // !message_error_urls.includes(profile.url) && message_error.push({ ...profile, always_send_error: false, msg_sent: false, error: error.message })
    }
}

export const handle_connection = async (
    profile,
    cookie,
    waiting_connection,
    waiting_connection_error,
    send_msg_with_connection,
    newProcessedUrl) => {
    // console.log(profile, cookie, waiting_connection, waiting_connection_error);
    const profile_data = { ...profile, send_msg_with_connection }
    try {
        const connectJson = await sendConnectionReq(profile_data, cookie)
        console.log(connectJson);
        if (connectJson.req_sent) {
            profile_data.send_msg_with_connection ?
                newProcessedUrl.push({
                    ...profile,
                    msg_sent: true,
                    msgId: null,
                    convId: null,
                    sent_msg_with_conn: true,
                }) :
                waiting_connection.push({
                    ...profile,
                    req_sent: connectJson.req_sent,
                    req_sent_error: false,
                    error: connectJson.error ?? "",
                    imageUrl: profile.imageUrl,
                    date: Date.now()
                })
            // console.log('connectJson.req_sent', connectJson.req_sent);

        } else {
            console.log('sendConnectionReq', profile);
            !waiting_connection_error.includes(profile.url) && waiting_connection_error.push({
                ...profile,
                req_sent: false,
                req_sent_error: true,
                error: connectJson.error ?? "",
                imageUrl: profile.imageUrl,
                date: Date.now()
            })
        }
    } catch (error) {
        console.log('handle_connection', error);
        waiting_connection_error.push({
            ...profile,
            req_sent: false,
            req_sent_error: true,
            error: error.message,
            imageUrl: profile.imageUrl,
            date: Date.now()
        })
    }
}

export const search_url = async (linkedin_search_url, start, cookie) => {
    const data = linkedin_search_url.startsWith('https://www.linkedin.com/sales/search/people') ?
        await handle_sales_search_url(linkedin_search_url, cookie, start) :
        await handle_linkedin_search_url(linkedin_search_url, cookie, start)

    const urls = [];
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const element = data[key];
            if (typeof element === 'object' && element !== null && 'url' in element) {
                urls.push(element.url);
            }
        }
    }
    return { data, urls }
}