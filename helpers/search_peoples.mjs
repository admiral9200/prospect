

export const modify_search_url = (search_url, page) => {
    const newUrl = new URL(search_url)
    const params = newUrl.searchParams
    let path = newUrl.pathname
    let get_url;
    let origin = params.get("origin")
    let keywords = encodeURIComponent(params.get("keywords"))
    let search_url_page = page ? page : params.get("page") ? params.get("page") * 10 - 10 : 0
    let isPeople = path.includes('people') ? true : false
    let isDetermisticUrl = search_url.includes('fetchDeterministicClustersOnly') ? true : false
    let queryParameters = '';

    for (let [key, value] of params) {
        // console.log(key, value);
        if (!["keywords", "origin", "page", "sid", "fetchDeterministicClustersOnly"].includes(key)) {
            try {
                const parsedValue = JSON.parse(value)
                // console.log(parsedValue[0]);
                queryParameters += `(key:${key},value:List(${parsedValue.join(',')})),`
                // queryParameters += `(key:${key},value:List(${parsedValue[0]})),`
            } catch (error) {
                // console.log(error);
                queryParameters += `(key:${key},value:List(${encodeURIComponent(value)})),`

            }
        }
    }

    get_url = `https://www.linkedin.com/voyager/api/graphql?variables=(start:${search_url_page},origin:${origin},query:(keywords:${keywords},flagshipSearchIntent:SEARCH_SRP,queryParameters:List(${queryParameters}(key:resultType,value:List(${isDetermisticUrl ? "ALL" : "PEOPLE"})))${!queryParameters.includes('talksAbout') ? ",includeFiltersInResponse:false" : ""}${isDetermisticUrl ? ",fetchDeterministicClustersOnly:true,clientSearchId:ea1b7d6b-5a48-40a7-9d5f-7401f23b01ce" : ""}))&&queryId=voyagerSearchDashClusters.a789a8e572711844816fa31872de1e2f`
    return { get_url, isDetermisticUrl }
}

export const fetch_peoples = async (url, COOKIE) => {
    try {
        const res = await fetch(url, {
            "headers": {
                "accept": "application/vnd.linkedin.normalized+json+2.1",
                "csrf-token": COOKIE.ajax.replace(/"/g, ''), // Stripping the quotes,
                "x-li-track": "{\"clientVersion\":\"1.13.330\",\"mpVersion\":\"1.13.330\",\"osName\":\"web\",\"timezoneOffset\":5,\"timezone\":\"Asia/Karachi\",\"deviceFormFactor\":\"DESKTOP\",\"mpName\":\"voyager-web\",\"displayDensity\":1.25,\"displayWidth\":1920,\"displayHeight\":1080}",
                "cookie": `li_at=${COOKIE.li_at}; JSESSIONID=${COOKIE.ajax};`,
            },
            "body": null,
            "method": "GET"
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();

        if (!json.included.length) {
            throw new Error(`Cannot extract peoples from empty arr`);
        }

        return json;
    } catch (error) {
        console.error('Fetch Error:', error); // Log the original error
        console.error('URL:', url); // Log the URL being fetched
        throw new Error(`Error fetching peoples from search url: ${error.message}`); // Include the original error message
    }
}


export const filter_peoples = async (json) => {
    const uuid = 'urn:li:fsd_profile'
    const filteredPpls = json.included.filter((ppl) => ppl?.image?.attributes[0]?.detailData?.nonEntityProfilePicture?.["*profile"]?.includes(uuid))
    const ppls = filteredPpls.map(ppl => {
        return !ppl?.navigationUrl.split('?')[0].includes('https://www.linkedin.com/search/results/people/headless') && {
            id: ppl?.navigationUrl.split('?')[1].split('%').reverse()[0],
            name: ppl?.title?.text,
            rawUrl: ppl?.navigationUrl,
            url: ppl?.navigationUrl.split('?')[0]
        }
    })
    // console.log(ppls);
    return ppls
}

export const peoples_pagination = async (json, isDetermisticUrl) => {
    const converting_result_to_page = (number) => {
        return Math.ceil(number / 10);
    }

    const total_page = json.data.data.searchDashClustersByAll.paging.total
    const pagination = {
        start: json?.data?.data?.searchDashClustersByAll?.paging?.start + 10, // need to modify
        total_pages: converting_result_to_page(total_page),
        total_search_results: isDetermisticUrl ? 1 : json?.data?.data?.searchDashClustersByAll?.paging?.total,
        total_max_results: isDetermisticUrl ? 1 : json?.data?.data?.searchDashClustersByAll?.metadata?.totalResultCount
    }
    pagination.campaign_running = pagination.start >= (pagination.total_pages * 10) ? false : true
    // console.log(pagination);
    return pagination
}