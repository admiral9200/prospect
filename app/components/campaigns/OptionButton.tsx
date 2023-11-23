import Image from "next/image";

interface OptionButtonProps {
    setOpen: any
}

const OptionButton = ({ setOpen }: OptionButtonProps) => {
    return (
        <button
            onClick={setOpen}
        >
            <Image 
                src={'/options.svg'}
                width={5}
                height={5}
                alt=""
            />
        </button>
    )
}

export default OptionButton;