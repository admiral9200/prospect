// @ts-nocheck
"use client";

import Button from "../Button";
import DomainTableRow from "../DomainTableRow";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

const DomainList = () => {
  const supabase = useSupabaseClient();
  const [domains, setDomains] = useState(null);
  const workspaceId = "19a686e9-c991-4905-9900-2476a62a8e65";

  const getAllDomains = async () => {
    const { data, error } = await supabase
      .from("workspace")
      .select("domains")
      .eq("id", workspaceId);
    if (!error) {
      const domainList = data[0].domains;
      // @ts-ignore
      setDomains(domainList);
    }
  };

  useEffect(() => {
    getAllDomains();
  }, []);

  return (
    <div className="px-4 w-full flex flex-col justify-start">
      {!domains ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="pb-4 flex justify-between items-center">
            <h2 className="text-[28px] font-bold">My Domains</h2>
            <div>
              <Button text="Add Domain" href="/add-domain" />
            </div>
          </div>
          <div className="my-8">
            <div>
              <p className="font-bold text-[20px] pb-4">Show result by:</p>
              {/* <ul className='flex list-none p-0'>
            <li>
              <button
                className={`${current == "today" ? 'bg-[#6039DB] text-white' : ''} border-2 border-[#6039DB] border-opacity-10 block hover:bg-[#6039DB] hover:bg-opacity-30 text-black font-semibold rounded-l-2xl w-[100px] text-sm lg:w-[120px] lg:text-md py-2`}
                onClick={() => filterData("today")}
              >
                Today
              </button>
            </li>
            <li>
              <button
                className={`${current == "this_week" ? 'bg-[#6039DB] text-white' : ''} border-2 border-[#6039DB] border-opacity-10 block hover:bg-[#6039DB] hover:bg-opacity-30 text-black font-semibold w-[100px] text-sm lg:w-[120px] lg:text-md py-2`}
                onClick={() => filterData("this_week")}
              >
                This Week
              </button>
            </li>
            <li>
              <button
                className={`${current == "this_month" ? 'bg-[#6039DB] text-white' : ''} border-2 border-[#6039DB] border-opacity-10 block hover:bg-[#6039DB] hover:bg-opacity-30 text-black font-semibold w-[100px] text-sm lg:w-[120px] lg:text-md py-2`}
                onClick={() => filterData("this_month")}
              >
                This month
              </button>
            </li>
            <li>
              <button
                className={`${current == "all_time" ? 'bg-[#6039DB] text-white' : ''} border-2 border-[#6039DB] border-opacity-10 block hover:bg-[#6039DB] hover:bg-opacity-30 text-black rounded-r-2xl font-semibold w-[100px] text-sm lg:w-[120px] lg:text-md py-2`}
                onClick={() => filterData("all_time")}
              >
                All time
              </button>
            </li>
          </ul> */}
            </div>
            <div className="w-full overflow-x-auto my-8 px-10">
              <table className="min-w-[1000px] text-sm table-auto text-left sm:w-auto md:w-full lg:w-full lg:text-lg">
                <thead>
                  <tr className="sm:text-[14px] border-b-[3px] border-gray-300">
                    <th className="py-2">Domain Names</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Emails sent</th>
                    <th className="py-2">Emails opened</th>
                    <th className="py-2">Email Delivered</th>
                    <th className="py-2 w-[180px]">Email marked as spammed</th>
                    <th className="py-2 w-[200px]">Deliverability note</th>
                  </tr>
                </thead>
                <tbody>
                  {domains.map((domain: any) => (
                    <DomainTableRow domain={domain} workspace={workspaceId} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DomainList;
