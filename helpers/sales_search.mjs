
export const modify_sales_search_url = (search_url, s, p) => {
    const url = new URL(search_url)
    const params = url.searchParams
    console.log(params);
    const query = params.get('query')
    const sessionId = encodeURIComponent(params.get('sessionId'))
    const page = p > 0 ? (p - 1) * 25 : s ? s : 0
    const start = (((params.get('page') ?? 1) - 1) * 25) ?? 0
    const getUrl = `https://www.linkedin.com/sales-api/salesApiLeadSearch?q=searchQuery&query=${query}&start=${page ? page : start}&count=${25}&trackingParam=(sessionId:${sessionId})&decorationId=com.linkedin.sales.deco.desktop.searchv2.LeadSearchResult-14`
    return getUrl
}

export const fetch_search_url = async (url, COOKIE) => {
    try {
        const res = await fetch(url, {
            "headers": {
                "csrf-token": COOKIE.ajax,
                "x-li-track": "{\"clientVersion\":\"1.0.6411\",\"mpVersion\":\"1.0.6411\",\"osName\":\"web\",\"timezoneOffset\":5,\"timezone\":\"Asia/Karachi\",\"deviceFormFactor\":\"DESKTOP\",\"mpName\":\"lighthouse-web\",\"displayDensity\":1.25,\"displayWidth\":1920,\"displayHeight\":1080}",
                "x-restli-protocol-version": "2.0.0",
                "cookie": `JSESSIONID ="${COOKIE.ajax}"; liap=${COOKIE.liap}; li_at=${COOKIE.li_at}; li_a=${COOKIE.li_a};`,
            },
            "body": null,
            "method": "GET"
        });
        if (!res.ok) throw new Error(res.status)

        const json = await res.json()
        return json
    } catch (error) {
        console.log(error);
        throw new Error(error.message)
    }
}


export const extract_data_search_url = (json) => {
    let data = json.elements.map(e => {
        return {
            id: e.entityUrn.split('(')[1].split(',')[0],
            name: e.fullName,
            degree: e.degree,
            address: e.geoRegion,
            trackingId: e.trackingId,
            imageUrl: e.profilePictureDisplayImage?.rootUrl + e.profilePictureDisplayImage?.artifacts[2]?.fileIdentifyingUrlPathSegment,
            about: e.summary,
            url: `https://www.linkedin.com/in/${e.entityUrn.split('(')[1].split(',')[0]}`
        }
    })

    const page = json.paging?.start ? (json.paging?.start / 25) + 2 : 2
    const pagination = {
        page: page,
        start: json.paging?.start + 25,
        count: json.paging?.count,
        total_search_results: json.paging?.total
    }
    pagination.campaign_running = pagination.start >= pagination.total_search_results ? false : true
    return { ...data, ...pagination }
}