import Image from "next/image";

interface FromLinkedInProps {
    setStep: any
}

const FromLinkedIn = ({ setStep }: FromLinkedInProps) => {
    return (
        <div className={`text-center flex flex-col justify-start items-start pt-[60px] lg:justify-center lg:items-center lg:pt-[250px] px-4`}>
            <div className="translate-y-[-50px] flex flex-col justify-start items-start">
                <p className="font-bold text-[24px] lg:text-[30px]">Import contacts via linkedin</p>
                <p className="text-[14px] lg:text-md">For Prosp to send messages from your account</p>
            </div>
            <button
                className={`border-[#6039DB] border-opacity-10 bg-white my-36 lg:mx-4 lg:my-16 block rounded-2xl border-[3px] w-full h-[200px] lg:w-[300px] lg:h-[200px] hover:border-[#6039DB]`}
                onClick={() => { setStep(2) }}
            >
                <div className="flex flex-col justify-center items-center">
                    <Image
                        src={`/linkedin_contact.svg`}
                        width={170}
                        height={170}
                        alt=""
                    />
                    <p className="font-bold">Connect your</p>
                    <p className="font-bold">LinkedIn Account</p>
                </div>
            </button>
            <div className="flex text-start border-gray-200 border-[1px] rounded-lg p-2 text-[12px] lg:justify-center items-start mt-12 lg:mt-0">
                <Image
                    src={'/info.svg'}
                    width={20}
                    height={20}
                    alt=""
                />
                <p className="px-2 text-sm lg:text-lg"><i>Refresh the page after installing the extension. Your session will be valid until you disconnect from LinkedIn.<a className="text-[#6039DB] font-semibold"><u>Refresh Now</u></a></i></p>
            </div>
        </div>
    )
}

export default FromLinkedIn;