import Image from "next/image";
import { useState } from "react";

interface ViewOptionProps {
    hideOrShowColumn: any
}

const ViewOption = ({ hideOrShowColumn }: ViewOptionProps) => {
    return (
        <div className="flex justify-between items-center">
            <div className="flex justify-center items-center">
                <Image
                    src={'/Union.svg'}
                    width={8}
                    height={8}
                    alt=""
                />
                <p className="pl-2">Name</p>
            </div>
            <button
                onClick={() => hideOrShowColumn('name')}
            >
                <Image
                    src={'/eye.svg'}
                    width={15}
                    height={15}
                    alt="w-full h-full"
                />
            </button>
        </div>
    )
}

export default ViewOption;