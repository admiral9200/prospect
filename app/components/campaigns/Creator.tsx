import Image from "next/image";

interface CreatorProps {
    name: string
}

const Creator = ({ name }: CreatorProps) => {
    return (
        <div className="flex justify-start items-center">
            <Image 
                src={'/avatar-17.png'}
                width={50}
                height={50}
                alt=""
                className="rounded-full"
            />
            <p className="pl-4">{ name }</p>
        </div>
    )
}

export default Creator;