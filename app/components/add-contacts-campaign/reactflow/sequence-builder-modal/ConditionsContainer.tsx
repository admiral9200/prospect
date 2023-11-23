import Image from "next/image";

const ConditionsContainer = ({ 
    setCondition,
    setOpen
 }) => {
    return (
        <div className="grid grid-cols-3 grid-rows-2 gap-4">
            <button className="flex justify-start items-center border-[3px] border-gray-300 rounded-[20px] p-4">
                <Image
                    src={'/add-contacts-campaign/has_email_address.svg'}
                    width={50}
                    height={50}
                    alt=""
                />
                <div className="flex flex-col justify-start items-start ml-2">
                    <p className="font-bold text-gray-800">Has email address</p>
                    <p className="text-gray-600 text-[13px]">Description will come here</p>
                </div>
            </button>
            <button className="flex justify-start items-center border-[3px] border-gray-300 rounded-[20px] p-4">
                <Image
                    src={'/add-contacts-campaign/has_linkedin_url.svg'}
                    width={50}
                    height={50}
                    alt=""
                />
                <div className="flex flex-col justify-start items-start ml-2">
                    <p className="font-bold text-gray-800">Has Linkedin URL</p>
                    <p className="text-gray-600 text-[13px]">Description will come here</p>
                </div>
            </button>
            <button className="flex justify-start items-center border-[3px] border-gray-300 rounded-[20px] p-4">
                <Image
                    src={'/add-contacts-campaign/accept_invite.svg'}
                    width={50}
                    height={50}
                    alt=""
                />
                <div className="flex flex-col justify-start items-start ml-2">
                    <p className="font-bold text-gray-800">Accept Invite</p>
                    <p className="text-gray-600 text-[13px]">Description will come here</p>
                </div>
            </button>
            <button className="flex justify-start items-center border-[3px] border-gray-300 rounded-[20px] p-4">
                <Image
                    src={'/add-contacts-campaign/open_email.svg'}
                    width={50}
                    height={50}
                    alt=""
                />
                <div className="flex flex-col justify-start items-start ml-2">
                    <p className="font-bold text-gray-800">Opened LinkedIn Message</p>
                    <p className="text-gray-600 text-[13px]">Description will come here</p>
                </div>
            </button>
            <button className="flex justify-start items-center border-[3px] border-gray-300 rounded-[20px] p-4">
                <Image
                    src={'/add-contacts-campaign/opened_linkedin_message.svg'}
                    width={50}
                    height={50}
                    alt=""
                />
                <div className="flex flex-col justify-start items-start ml-2">
                    <p className="font-bold text-gray-800">Opened LinkedIn Message</p>
                    <p className="text-gray-600 text-[13px]">Description will come here</p>
                </div>
            </button>
            <button className="flex justify-start items-center border-[3px] border-gray-300 rounded-[20px] p-4">
                <Image
                    src={'/add-contacts-campaign/clicked_link.svg'}
                    width={50}
                    height={50}
                    alt=""
                />
                <div className="flex flex-col justify-start items-start ml-2">
                    <p className="font-bold text-gray-800">Clicked link in email</p>
                    <p className="text-gray-600 text-[13px]">Description will come here</p>
                </div>
            </button>
        </div>
    )
}

export default ConditionsContainer;