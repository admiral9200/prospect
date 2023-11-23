import Image from "next/image";

interface LogItemProps {
    log: any
}

const LogItem = ({ log }: LogItemProps) => {
    return (
        <div className="flex justify-between items-center py-5">
            <div className="flex justify-center items-center">
                {/* <div>{ log.created_at }</div> */}
                <div>2 hr ago</div>
                <div className="pl-32 flex">
                    <Image 
                        src={ log.img }
                        width={30}
                        height={30}
                        alt=""
                        className="rounded-full"
                    />
                    <p className="pl-2">{ log.action }</p>
                    <p className="underline pl-2">{ log.receiver }</p>
                </div>
            </div>
            <div className="flex w-[200px] lg:w-[300px]">
                <Image 
                    src={'/avatar-17.png'}
                    width={30}
                    height={30}
                    alt=""
                    className="rounded-full"
                />
                <p className="pl-2">{ log.sender }</p>
            </div>
        </div>
    )
}

export default LogItem;