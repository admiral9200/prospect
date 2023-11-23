import {
    modify_search_url,
    fetch_peoples,
    filter_peoples,
    peoples_pagination
} from './search_peoples.mjs'
import {
    modify_sales_search_url,
    fetch_search_url,
    extract_data_search_url
} from './sales_search.mjs'

export const handle_linkedin_search_url = async (linkedin_search_url, cookie, start) => {
    const urlObj = await modify_search_url(linkedin_search_url, start)
    const res_peoples = await fetch_peoples(urlObj.get_url, cookie) // error
    const filtered_peoples = await filter_peoples(res_peoples)
    const pagination = await peoples_pagination(res_peoples, urlObj.isDetermisticUrl)
    const data = { ...filtered_peoples, ...pagination }
    return data
}

export const handle_sales_search_url = async (linkedin_search_url, cookie, start) => {
    const getUrl = await modify_sales_search_url(linkedin_search_url, start)
    const json = await fetch_search_url(getUrl, cookie) // error
    const extractedData = await extract_data_search_url(json)
    return extractedData
}