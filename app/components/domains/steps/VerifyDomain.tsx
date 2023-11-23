// @ts-nocheck
"use client";

import VerifyDomainBubble from "../VerifyDomainBubble";
import VerifyingStatus from "../VerifyingStatus";
import ToggleStatus from "../ToggleStatus";
import { useEffect } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
// verified status = pending | veified 

const VerifyDomain = () => {
  const [domainData, setDomainData] = useState(null);
  const [loading, setLoading] = useState(false)
  const supabase = useSupabaseClient();
  const user = useUser();
  const searchParams = useSearchParams();

  const domainId = searchParams.get("domainId");
  const workspaceId = searchParams.get("workspaceId");

  const getStoredDomainData = async () => {
    const { data, error } = await supabase
      .from("workspace")
      .select("domains")
      .eq("id", workspaceId);

    if (!error) {
      const domains = data[0].domains;
      const domain = domains.find((domain) => domain.id === Number(domainId));
      setDomainData(domain);
    } else {
      // direct to our error and retry page
    }
  };

  const verifyDomain = async () => {
      const payload = JSON.stringify({
        domainId,
        workspaceId
      })
      setLoading(true)
      const newDomainData = await axios.post('/api/verify-domain', payload);
      setLoading(false)
      const toState = {
          ...domainData,
          valid: newDomainData.data.data.valid,
          dns_data: {
            cname: {
              data: domainData.dns_data.cname.data,
              host: domainData.dns_data.cname.host,
              valid: newDomainData.data.data.validation_results.mail_cname.valid
            },
            dkim1: {
              data: domainData.dns_data.dkim1.data,
              host: domainData.dns_data.dkim1.host,
              valid: newDomainData.data.data.validation_results.dkim1.valid
            },
            dkim2: {
              data: domainData.dns_data.dkim2.data,
              host: domainData.dns_data.dkim2.host,
              valid: newDomainData.data.data.validation_results.dkim2.valid
            }
          }
      }

      setDomainData(toState);
  }

  useEffect(() => {
    if (user) {
      getStoredDomainData();
    }
  }, [user]);



  return (
    <div className="px-4 w-full flex flex-col justify-start pt-16">
      {!domainData ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="pb-4">
            <h2 className="text-[28px] font-bold">My Domains</h2>
          </div>
          <div>
            <VerifyDomainBubble
              valid={domainData.valid}
              name={domainData.name}
              loading={loading}
              verifyDomain={verifyDomain}
            />
          </div>
          <div className="my-8">
            <p className="font-bold text-[20px] pb-4">DNS Records</p>
            <div className="w-full overflow-x-auto mb-8">
              <table className="min-w-[1000px] text-sm table-auto text-left sm:w-full md:w-full lg:w-full lg:text-lg">
                <thead>
                  <tr className="border-b-[3px] border-gray-300">
                    <th className="py-2">Type</th>
                    <th className="py-2 w-[50%]">Value</th>
                    <th className="py-2 w-[15%]">Host</th>
                     <th className='py-2 w-[15%]'>Priority</th>
                    <th className='py-2 pr-10 '>TTL</th>
                    <th className="py-2 w-[200px]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className=" border-b-2 border-gray-200">
                    <td className="py-8">CNAME</td>
                    <td className="py-8">{domainData.dns_data.cname.data}</td>
                    <td className="py-8">{domainData.dns_data.cname.host}</td>
                     <td className='py-8'>10</td>
                     <td className='py-8'>Auto</td>
                     <td className="py-8">
                      <VerifyingStatus isVerified={domainData.dns_data.cname.valid} />
                    </td>
                  </tr>
                  <tr className=" border-b-2 border-gray-200">
                    <td className="py-8">DKIM 1</td>
                    <td className="py-8">{domainData.dns_data.dkim1.data}</td>
                    <td className="py-8">{domainData.dns_data.dkim1.host}</td>
                     <td className='py-8'>10</td>
                     <td className='py-8'>Auto</td>
                    <td className="py-8">
                      <VerifyingStatus isVerified={domainData.dns_data.dkim1.valid} />
                    </td>
                  </tr>
                  <tr className=" border-b-2 border-gray-200">
                    <td className="py-8">DKIM 2</td>
                    <td className="py-8">{domainData.dns_data.dkim2.data}</td>
                    <td className="py-8">{domainData.dns_data.dkim2.host}</td>
                     <td className='py-8'>10</td>
                     <td className='py-8'>Auto</td>
                    <td className="py-8">
                      <VerifyingStatus isVerified={domainData.dns_data.dkim2.valid} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VerifyDomain;

// {
//   /* Tracking UI */
// }
// {
//   /* <div>
//                 <p className='font-bold pb-2 text-[20px]'>
//                     Configuration
//                 </p>
//                 <div className='flex flex-wrap'>
//                     <div>
//                         <div className='bg-gray-100 p-4 rounded-xl lg:w-[450px] mb-4 mr-4 mt-4'>
//                             <div className='pb-2'>
//                                 <ToggleStatus />
//                             </div>
//                             <div>
//                                 <p className='font-bold text-[16px]'>
//                                     Open Tracking
//                                 </p>
//                                 <p className='opacity-90 text-[12px] lg:text-[16px] '>
//                                     A 1×1 pixel transparent GIF image is inserted in each email and includes a unique reference. When the image is downloaded, an open event is triggered. Consider if open tracking is right for you.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                     <div>
//                         <div className='bg-gray-100 p-4 rounded-xl lg:w-[450px] mb-4 mr-4 mt-4'>
//                             <div className='pb-2'>
//                                 <ToggleStatus />
//                             </div>
//                             <div>
//                                 <p className='font-bold text-[16px]'>
//                                     Open Tracking
//                                 </p>
//                                 <p className='opacity-90 text-[12px] lg:text-[16px] '>To track clicks, Resend modifies each link in the body of the HTML email. When recipients open a link, they are sent to a Resend server, and are immediately redirected to the URL destination.</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div> */
// }
// {
//   /* </div> */
// }


