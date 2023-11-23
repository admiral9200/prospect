
export const one_month_past = (p) => {
    const timeStamp = p.date
    const currentTime = new Date()
    const oneMonthAgo = new Date(currentTime)
    oneMonthAgo.setMonth(currentTime.getMonth() - 1)
    const oneMonthAgoTimeStamp = oneMonthAgo.getTime()
    return oneMonthAgoTimeStamp <= timeStamp
} 