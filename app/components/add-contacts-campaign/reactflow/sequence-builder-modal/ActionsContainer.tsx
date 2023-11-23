import Image from "next/image";

const ActionsContainer = ({ 
    setAction,
    setOpen
 }) => {
    return (
        <div className="grid grid-cols-3 grid-rows-2 gap-4">
            <button 
                className="flex justify-start items-center border-[3px] border-gray-300 rounded-[20px] p-4"
                onClick={() => {setAction("SEND_LINKEDIN_CONNECTION_REQUEST"); setOpen(false)}}
            >
                <Image
                    src={'/add-contacts-campaign/linkedin_connction_request.svg'}
                    width={50}
                    height={50}
                    alt=""
                />
                <div className="flex flex-col justify-start items-start ml-2">
                    <p>Send linkedin</p>
                    <p>connection request</p>
                </div>
            </button>
            <button className="flex justify-start items-center border-[3px] border-gray-300 rounded-[20px] p-4">
                <Image
                    src={'/add-contacts-campaign/linkedin_message.svg'}
                    width={50}
                    height={50}
                    alt=""
                />
                <div className="flex flex-col justify-start items-start ml-2">
                    <p>Send linkedin</p>
                    <p>message</p>
                </div>
            </button>
            <button className="flex justify-start items-center border-[3px] border-gray-300 rounded-[20px] p-4">
                <Image
                    src={'/add-contacts-campaign/personalized_email.svg'}
                    width={50}
                    height={50}
                    alt=""
                />
                <div className="flex flex-col justify-start items-start ml-2">
                    <p>Send personalized</p>
                    <p>e-mail</p>
                </div>
            </button>
            <button className="flex justify-start items-center border-[3px] border-gray-300 rounded-[20px] p-4">
                <Image
                    src={'/add-contacts-campaign/linkedin_voice_note.svg'}
                    width={50}
                    height={50}
                    alt=""
                />
                <div className="flex flex-col justify-start items-start ml-2">
                    <p>Send linkedin</p>
                    <p>voice note</p>
                </div>
            </button>
            <button className="flex justify-start items-center border-[3px] border-gray-300 rounded-[20px] p-4">
                <Image
                    src={'/add-contacts-campaign/comment_last_user.svg'}
                    width={50}
                    height={50}
                    alt=""
                />
                <div className="flex flex-col justify-start items-start ml-2">
                    <p>Comment lat</p>
                    <p>user linkedin post</p>
                </div>
            </button>
            <button className="flex justify-start items-center border-[3px] border-gray-300 rounded-[20px] p-4">
                <Image
                    src={'/add-contacts-campaign/last_user_linkedin_post.svg'}
                    width={50}
                    height={50}
                    alt=""
                />
                <div className="flex flex-col justify-start items-start ml-2">
                    <p>Like last user</p>
                    <p>linkedin post</p>
                </div>
            </button>
        </div>
    )
}

export default ActionsContainer;