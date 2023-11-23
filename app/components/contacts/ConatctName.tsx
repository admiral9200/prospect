import Image from "next/image";

interface ContactNameProps {
    imageUrl: string,
    name: string
}

const ContactName = ({ imageUrl, name }: ContactNameProps) => {
    return (
        <div className="flex justify-start ml-5 center items-center translate-x-[-25px]">
            <div className="rounded-full min-w-[50px] max-w-[50px]">
                <Image 
                    src={imageUrl}
                    width={50}
                    height={50}
                    alt=""
                    className="rounded-full"
                />
            </div>
            <p className="ml-2">{ name }</p>
        </div>
    )
}

export default ContactName;