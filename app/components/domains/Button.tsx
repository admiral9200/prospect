import Link from "next/link";

const Button = ({ text, href }) => {
    return (
        <Link href={href}>
        <button
            className='text-white w-auto px-8 h-[50px] text-[12px] lg:text-[16px] bg-[#6039DB] rounded-xl'
        >
            { text }
        </button>
        </Link>
    )
}

export default Button;