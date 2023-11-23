interface ExistingCampaignProps {
    handleCurrentCampaign: any,
    currentCampaign: string
}

const FromExistingCampaign = ({
    handleCurrentCampaign,
    currentCampaign
}) => {
    return (
        <div className="text-left lg:text-center flex flex-col items-start mt-4 px-4 justify-center lg:items-center lg:pt-[250px]">
            <p className="font-bold text-[28px]">Import contacts via Existing Campaign</p>
            <p className="text-[14px] pb-8 lg:text-md">Select campaign for import contact</p>

            <div className=" bg-white p-4 mb-4 border-[1px] rounded-2xl w-full lg:w-[28rem] lg:border-0">
                <fieldset>
                    <legend className="sr-only">Notifications</legend>
                    <div className="space-y-5 p-4">
                        <div className="relative flex items-start border-b-[1px] lg:border-b-2 border-gray-200 lg:border-gray-300 pb-6">
                            <div className="flex h-6 items-center">
                                <input
                                    id="comments"
                                    aria-describedby="comments-description"
                                    name="comments"
                                    type="checkbox"
                                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    onChange={() => handleCurrentCampaign("campaign_01")}
                                />
                            </div>
                            <div className="flex flex-col justify-start items-start ml-3 text-sm leading-6">
                                <label htmlFor="comments"
                                    className={`${currentCampaign == "campaign_01" ? "text-[#6039DB]" : "text-gray-900"} font-medium text-md`}
                                >
                                    Campaign 1
                                </label>
                                <p id="comments-description" className="text-gray-500 lg:block">
                                    Total number of contacts : 2203
                                </p>
                            </div>
                        </div>
                        <div className="relative flex items-start border-b-[1px] lg:border-b-2 border-gray-200 lg:border-gray-300 pb-6">
                            <div className="flex h-6 items-center">
                                <input
                                    id="comments"
                                    aria-describedby="comments-description"
                                    name="comments"
                                    type="checkbox"
                                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    onChange={() => handleCurrentCampaign("campaign_02")}
                                />
                            </div>
                            <div className="flex flex-col justify-start items-start ml-3 text-sm leading-6">
                                <label htmlFor="comments"
                                    className={`${currentCampaign == "campaign_02" ? "text-[#6039DB]" : "text-gray-900"} font-medium text-md`}
                                >
                                    Campaign 2
                                </label>
                                <p id="comments-description" className="text-gray-500 lg:block">
                                    Total number of contacts : 2203
                                </p>
                            </div>
                        </div>
                        <div className="relative flex items-start lg:border-b-2 border-gray-200 lg:border-gray-300 ">
                            <div className="flex h-6 items-center">
                                <input
                                    id="comments"
                                    aria-describedby="comments-description"
                                    name="comments"
                                    type="checkbox"
                                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    onChange={() => handleCurrentCampaign("campaign_03")}
                                />
                            </div>
                            <div className="flex flex-col justify-start items-start ml-3 text-sm leading-6">
                                <label htmlFor="comments"
                                    className={`${currentCampaign == "campaign_03" ? "text-[#6039DB]" : "text-gray-900"} font-medium text-md`}
                                >
                                    Campaign 3
                                </label>
                                <p id="comments-description" className="text-gray-500 lg:block">
                                    Total number of contacts : 2203
                                </p>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>

            <button className='fixed bottom-4 left-0 right-0 mx-auto bg-[#6039DB] text-white rounded-xl py-3 px-8 w-[180px]'>
                Done
            </button>
        </div>
    )
}

export default FromExistingCampaign;