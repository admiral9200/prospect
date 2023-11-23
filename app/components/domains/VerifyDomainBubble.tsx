import Image from "next/image";
import Button from "./Button";
import VerifyingStatus from "./VerifyingStatus";
import { useState } from "react";

interface VerifyDomainBubbleProps {
  valid: boolean;
  name: string;
  loading: boolean;
  verifyDomain: () => void;
}

const VerifyDomainBubble = ({
  valid,
  name,
  loading,
  verifyDomain,
}: VerifyDomainBubbleProps) => {


  return (
    <div className="w-full bg-[#52B5F9] bg-opacity-10 rounded-2xl h-auto py-4 flex justify-start items-center px-8">
      <div className="w-full flex flex-col lg:py-8 lg:flex-row lg:justify-between lg:items-center">
        <div className="flex flex-col justify-between items-center lg:flex-row lg:justify-start lg:items-center">
          <div className="flex justify-between items-center">
            <div className="flex justify-between lg:justify-start items-center pr-8">
              <Image src={"/domain.svg"} height={50} width={50} alt="" />
              <div className="pl-2 flex flex-col justify-start">
                <p className="text-[10px] lg:text-[14px] opacity-80">Domain</p>
                <p className="text-[14px] lg:font-semibold lg:text-[20px]">
                  {name}
                </p>
              </div>
            </div>
            <div className="border-l-0 lg:border-l-[3px] py-4 border-gray-300 px-8">
              <VerifyingStatus isVerified={valid} />
            </div>
          </div>
          {valid && (
            <div className="bg-white rounded-xl w-auto p-4">
              <div className="text-[10px] flex flex-row justify-between items-center lg:text-[14px]">
                <div>
                  <select className="text-[#6039DB] text-[12px] rounded-xl border-0 bg-[#6039DB] bg-opacity-20">
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <div className="flex flex-col justify-start items-center mx-4">
                  <p className="opacity-70">Email Sent</p>
                  <p className="font-semibold">2589</p>
                </div>
                <div className="flex flex-col justify-start items-center mx-4">
                  <p className="opacity-70">Email Delivered</p>
                  <p className="font-semibold">1030</p>
                </div>
                <div className="flex flex-col justify-start items-center mx-4">
                  <p>Email Opened</p>
                  <p className="font-semibold">1030</p>
                </div>
                <div className="flex flex-col justify-start items-center mx-4">
                  <p>Spam Reports</p>
                  <p className="font-semibold">1030</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4">
          {!valid && (
            <button
              className="text-white w-auto px-8 h-[50px] text-[12px] lg:text-[16px] bg-[#6039DB] rounded-xl"
              onClick={() => verifyDomain()}
            >
              {loading && "verifying your records"}
              {!loading && "Verify records"}
            </button>
          )}
          {valid && (
            <div className="flex justify-center items-center">
              <Image src={"/verified.svg"} width={30} height={30} alt="" />
              <p className="text-[12px] text-[#22A04E] lg:text-[20px] pl-2">
                Verified
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default VerifyDomainBubble;
