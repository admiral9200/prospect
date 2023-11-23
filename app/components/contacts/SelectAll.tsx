import { useState } from "react";

interface SelectAllProps {
    isSelectedAll: boolean,
    selectAll: any
}

const SelectAll = ({ isSelectedAll, selectAll }: SelectAllProps) => {
    return (
        <div className="flex flex-col justify-center items-center">
            <input
                id="comments"
                aria-describedby="comments-description"
                name="comments"
                type="checkbox"
                className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600`}
                onChange={e => selectAll(e.target.value)}
                checked={isSelectedAll}
            />
            <div className="">
                <p className="text-[12px]">Select all</p>
            </div>
        </div>
    )
}

export default SelectAll;