import Image from "next/image";
import Link from "next/link";
import VerifyingStatus from "./VerifyingStatus";
import { useRouter } from 'next/navigation';

const DomainTableRow = ({ domain, workspace }) => {
  const router = useRouter();
  return (
      <tr
        onClick={() => router.push(`/verify-domain?workspaceId=${workspace}&domainId=${domain.id}`)}
        key={domain.id}
        className="text-[12px] sm:text-[12px] md:text-[13px] lg:text-[16px] border-b-2 border-gray-200 hover:cursor-pointer hover:bg-gray-200 active:bg-gray-500"
      >
        <td className="py-8">
          <div className="flex justify-start items-center">
            <Image src={"/domain.svg"} width={32} height={32} alt="" />
            <p className="pl-2">{domain.name}</p>
          </div>
        </td>
        <td className="py-8">
          <VerifyingStatus isVerified={domain.valid} />
        </td>
        <td className="py-8">{domain.emailsSent || "John"}</td>
        <td className="py-8">{domain.emailsOpened || "John"}</td>
        <td className="py-8">{domain.emailsDelivered || "John"}</td>
        <td className="py-8">{domain.spamReports || "John"}</td>
        <td className="py-8">{domain.deliverabilityNote || "John"}</td>
      </tr>
  );
};

export default DomainTableRow;
