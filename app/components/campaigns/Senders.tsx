import Image from "next/image";

interface SendersProps {
    urls: any
}

const Senders = ({ urls }: SendersProps) => {
    return (
        <div className="flex -space-x-2 justify-start">
            {urls.map((url: string, index: number) => {
                return (
                    <div 
                        key={url}
                        className={``}
                    >
                        <Image
                            src={url}
                            width={50}
                            height={50}
                            alt=""
                            className="rounded-full inline border-4 border-white"
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default Senders;