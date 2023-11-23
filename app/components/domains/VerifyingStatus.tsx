interface StatusProps {
    isVerified: boolean
}

const VerifyingStatus = ({ isVerified }: StatusProps) => {
   if(!isVerified) {
        return (
            <div className="bg-[#FECA44] text-black text-[12px] sm:text-[14px] md:text-[14px] lg:text-[16px] w-[100px] h-[20px] rounded-full px-2 py-4 flex justify-center items-center">
                Pending
            </div>
        )
    } else if(isVerified) {
        return (
            <div className="bg-[#22A04E] text-white text-[12px] sm:text-[14px] md:text-[14px] lg:text-[16px] w-[90px] h-[20px] rounded-full px-2 py-4 flex justify-center items-center">
                Success
            </div>
        )
    }
}

export default VerifyingStatus;