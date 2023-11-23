import Image from "next/image";
import { useState } from "react";

interface TextFilterBoxProps {
    visible: boolean,
    type: string,
    filterFunc: any
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const TextFilterBox = ({ visible, type, filterFunc }: TextFilterBoxProps) => {
    const [keyword, setKeyword] = useState<string>("");
    const [flag, setFlag] = useState<string>("contains");

    const items = [
        'contains',
        'does not contain',
        'start with',
        'is',
        'is not',
        'is empty',
        'is not empty'
    ];

    const className = () => {
        if(type == "name") {
            return 'absolute top-[10px] right-[-220px] z-30 bg-white w-[250px] h-auto shadow-2xl rounded-2xl p-4'
        }

        if(type == "email") {
            return 'absolute top-[45px] right-[-220px] z-30 bg-white w-[250px] h-auto shadow-2xl rounded-2xl p-4'
        }

        if(type == "phone") {
            return 'absolute top-[80px] right-[-220px] z-30 bg-white w-[250px] h-auto shadow-2xl rounded-2xl p-4'
        }

        if(type == "title") {
            return 'absolute top-[150px] right-[-220px] z-30 bg-white w-[250px] h-auto shadow-2xl rounded-2xl p-4'
        }

        if(type == "status") {
            return 'absolute top-[190px] right-[-220px] z-30 bg-white w-[250px] h-auto shadow-2xl rounded-2xl p-4'
        }

        if(type == "company") {
            return 'absolute top-[230px] right-[-220px] z-30 bg-white w-[250px] h-auto shadow-2xl rounded-2xl p-4'
        }
    }

    const handleKeyDown = (e: any) => {
        if(e.key == 'Enter') {
            filterFunc(type, keyword, flag);
            setKeyword("");
        }
    }

    return (
        <div className={`${classNames(visible ? className() : 'hidden')}`}>
            <div className=" flex justify-between items-center">
                <div className="flex justify-center items-center">
                    <p>{ type }</p>
                    <select 
                        className="border-none w-[110px] pl-2 font-bold text-[14px]"
                        onChange={e => setFlag(e.target.value)}
                        value={flag}
                    >
                        {
                            items.map((item: string, index: number) => (
                                <option key={index}>{item}</option>
                            ))
                        }
                    </select>
                </div>
                <Image
                    src={'/rest_icon.svg'}
                    width={20}
                    height={20}
                    alt=""
                />
            </div>
            <div>
                <input
                    type="text"
                    name="text filter"
                    id="text-filter"
                    className="block w-full rounded-md border-none py-2 my-2 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-black placeholder:opacity-80 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:text-sm sm:leading-6"
                    placeholder="Add Value"
                    onKeyDown={e => handleKeyDown(e)}
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                />
            </div>
        </div>
    )
}

export default TextFilterBox;