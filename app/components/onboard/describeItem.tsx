import { useState } from "react";

/**
 * @desc step 1
 * @param param0 
 * @returns 
 */
export default function DescribeItem ({ setDescribeItem, describe, item, index, selected }) {
    return (
        <button
            className={`flex items-center pl-4 mt-1 w-full h-12 font-bold rounded-md border-gray-200 border-[1px] text-black text-[14px] hover:border-l-blue-500 hover:border-t-blue-500 hover:border-r-blue-500 active:border-blue-500 ${selected - 1 === index ? ' border-blue-500 border-[2px] shadow-sm': ' '}`}
            onClick={() => {
                setDescribeItem(index + 1); 
            }}
        >
            {item}
        </button>
    )
  }