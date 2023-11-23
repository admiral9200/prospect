interface ContactRowProps {
    children: any
}

const ContactRow = ({ children }: ContactRowProps) => {
    if(children != undefined) {
        return (
            <td className="border-b px-4 py-3 font-normal text-[13px] lg:py-4 text-left">
                {
                    children
                }
            </td>
        )
    }
}

export default ContactRow;