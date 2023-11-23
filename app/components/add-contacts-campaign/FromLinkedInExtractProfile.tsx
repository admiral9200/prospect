const FromLinkedinExtractProfile = () => {
    return (
        <div className={`text-center flex flex-col justify-start items-start pt-[60px] lg:justify-center lg:items-center lg:pt-[250px] lg:w-[500px] px-4 lg:mx-auto`}>
            <div className="translate-y-[-50px] flex flex-col justify-start items-start">
                <p className="font-bold text-[24px] lg:text-[30px]">Import contacts via linkedin</p>
                <p className="text-[14px] lg:text-md">For Prosp to send messages from your account</p>
            </div>
            <div className="w-full flex flex-col justify-start items-start">
                <p className="text-left font-bold text-[15px] mb-2">Extract all profiles URLs from a Linkedin Search</p>
                <div className="text-left w-full border-[1px] border-gray-200 rounded-lg h-auto p-4">
                    <input
                        className="block border-0 w-full text-[14px]"
                        placeholder="https://www.linkedin.com/search/results/people"
                    />
                    <button className="bg-[#6039DB] bg-opacity-10 text-[#6039DB] mt-6 rounded-lg font-semibold py-2 px-4">
                        Extract Profiles
                    </button>
                </div>
            </div>
            <button className="fixed bottom-4 left-0 right-0 mx-auto bg-[#6039DB] text-white rounded-xl py-3 px-8 w-[180px] lg:hidden">
                Done
            </button>
        </div>
    )
}

export default FromLinkedinExtractProfile;