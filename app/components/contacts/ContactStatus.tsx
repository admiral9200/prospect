interface StatusProps {
    isContacted: string
}

const ContactStatus = ({ isContacted }: StatusProps) => {
    if(isContacted == "contacted") {
        return (
            <div className="bg-[#22A04E] text-white w-[100px] h-[20px] rounded-full px-2 py-4 flex justify-center items-center">
                Contacted
            </div>
        )
    } else if(isContacted == "not_contacted") {
        return (
            <div className="bg-[#E3E9F8] text-black w-[160px] h-[20px] rounded-full px-2 py-4 flex justify-center items-center">
                Not Contacted
            </div>
        )
    } else if(isContacted == "pending") {
        return (
            <div className="bg-[#FECA44] text-black w-[90px] h-[20px] rounded-full px-2 py-4 flex justify-center items-center">
                In Queue
            </div>
        )
    }
}

export default ContactStatus;