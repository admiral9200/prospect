const FromLinkedinExtractProfile = ({ setStep }) => {
    return (
        <div className={`text-center flex flex-col justify-start items-start pt-[60px] lg:justify-center lg:items-center lg:pt-[250px] lg:w-[500px] px-4 lg:mx-auto`}>
            <div className="translate-y-[-50px] flex flex-col justify-start items-start">
                <p className="font-bold text-[24px] lg:text-[30px]">Import contacts via linkedin</p>
                <p className="text-[14px] lg:text-md">Extract all profiles URLs from a Linkedin Search</p>
            </div>
            <div className="w-full lg:w-[600px] flex flex-col justify-start items-start">
                <div className="relative text-left w-full border-[1px] lg:border-0 border-gray-200 rounded-lg h-[100px] lg:px-2 lg:py-1.5">
                    <input
                        className="block border-0 lg:border-[2px] lg:py-4 lg:rounded-lg lg:border-gray-300 w-full text-[14px]"
                        placeholder="https://www.linkedin.com/search/results/people"
                    />
                    <button
                        className="absolute ml-2 bottom-2 lg:w-[180px] lg:right-4  lg:bottom-[45px] bg-[#6039DB] bg-opacity-10 text-[#6039DB] mt-6 rounded-lg font-semibold py-2 px-4"
                    >
                        Extract Profiles
                    </button>
                    <button 
                        className="fixed bottom-4 lg:absolute left-0 right-0 mx-auto lg:bottom-[-80px] bg-[#6039DB] text-white rounded-xl py-3 px-8 w-[180px]"
                        onClick={() => setStep(3)}
                    >
                        Done
                    </button>
                </div>

            </div>

        </div>
    )
}

export default FromLinkedinExtractProfile;