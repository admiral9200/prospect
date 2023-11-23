import Creator from "./Creator";
import Senders from "./Senders";
import ToggleStatus from "./ToggleStatus"

interface CampaignTableRowProps {
    row: any
}

const CampaignTableRow = ({ row }: CampaignTableRowProps) => {
    return (
        <tr 
            key={row.id}
            className={`text-sm lg:text-sm hover:cursor-pointer hover:bg-gray-200 `}
        >
            <td className="border-b px-4 py-6 text-left"><ToggleStatus /></td>
            {row.name != undefined && <td className="border-b px-4 text-left">{ row.name }</td>}
            {row.lead_ended != undefined && <td className="border-b px-4 text-left">{row.lead_ended}</td>}
            {row.creator != undefined && <td className="border-b px-4 text-left"><Creator name={row.creator} /></td>}
            {row.creator != undefined && <td className="border-b px-4 text-left">{row.created_at}</td>}
            {row.senders != undefined && <td className="border-b px-4 text-left"><Senders urls={row.senders} /></td>}
        </tr>
    )
}

export default CampaignTableRow;