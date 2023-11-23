import Image from "next/image"

interface ViewOptionsProps {
    visible: boolean,
    hideOrShowColumn: any,
    columns: any
}

const ViewOptions = ({ visible, hideOrShowColumn, columns }: ViewOptionsProps) => {

    return (
        <div className={`${visible ? 'absolute z-20 right-[-20px] top-8 bg-white w-[250px] h-auto shadow-2xl rounded-2xl' : 'hidden'}`}>
            <div>
                <h4 className="pl-4 pt-3 mb-3 font-bold text-lg">View Option</h4>
            </div>
            <div>
                <div className="my-4">
                    <p className="px-4 py-2">Shown</p>
                    <div className="border-b-2 border-gray-200 w-[90%] m-auto"></div>
                </div>
                {
                    columns.map((col: any) => {
                        return (
                            <>
                                <div
                                    className="px-4 py-2 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                                    onClick={() => { }}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex justify-center items-center">
                                            <Image
                                                src={'/Union.svg'}
                                                width={8}
                                                height={8}
                                                alt=""
                                            />
                                            <p className="pl-2">{col.label}</p>
                                        </div>
                                        <button
                                            onClick={() => hideOrShowColumn(col.id)}
                                        >
                                            <Image
                                                src={'/eye.svg'}
                                                width={15}
                                                height={15}
                                                alt="w-full h-full"
                                            />
                                        </button>
                                    </div>
                                </div><br />
                            </>
                        )
                    })
                }
                <div
                    className="px-4 py-2 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onClick={() => { }}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex justify-center items-center">
                            <Image
                                src={'/plus_black.svg'}
                                width={10}
                                height={10}
                                alt=""
                            />
                            <p className="pl-2">Add Column</p>
                        </div>
                        <div></div>
                    </div>
                </div><br />
            </div>
            <div>
                <div className="my-4">
                    <p className="px-4 py-2">Hidden</p>
                    <div className="border-b-2 border-gray-200 w-[90%] m-auto"></div>
                </div>
                <div
                    className="px-4 py-2 opacity-60 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onClick={() => { }}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex justify-center items-center">
                            <Image
                                src={'/Union.svg'}
                                width={8}
                                height={8}
                                alt=""
                            />
                            <p className="pl-2">Country code</p>
                        </div>
                        <button>
                            <Image
                                src={'/eye.svg'}
                                width={15}
                                height={15}
                                alt=""
                            />
                        </button>
                    </div>
                </div><br />
                <div
                    className="px-4 py-2 opacity-60 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onClick={() => { }}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex justify-center items-center">
                            <Image
                                src={'/Union.svg'}
                                width={8}
                                height={8}
                                alt=""
                            />
                            <p className="pl-2">Skills</p>
                        </div>
                        <button>
                            <Image
                                src={'/eye.svg'}
                                width={15}
                                height={15}
                                alt=""
                            />
                        </button>
                    </div>
                </div><br />
                <div
                    className="px-4 py-2 opacity-60 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onClick={() => { }}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex justify-center items-center">
                            <Image
                                src={'/Union.svg'}
                                width={8}
                                height={8}
                                alt=""
                            />
                            <p className="pl-2">Sub title</p>
                        </div>
                        <button>
                            <Image
                                src={'/eye.svg'}
                                width={15}
                                height={15}
                                alt=""
                            />
                        </button>
                    </div>
                </div><br />
                <div
                    className="px-4 py-2 opacity-60 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onClick={() => { }}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex justify-center items-center">
                            <Image
                                src={'/Union.svg'}
                                width={8}
                                height={8}
                                alt=""
                            />
                            <p className="pl-2">Headline</p>
                        </div>
                        <button>
                            <Image
                                src={'/eye.svg'}
                                width={15}
                                height={15}
                                alt=""
                            />
                        </button>
                    </div>
                </div><br />
                <div
                    className="px-4 py-2 opacity-60 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onClick={() => { }}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex justify-center items-center">
                            <Image
                                src={'/Union.svg'}
                                width={8}
                                height={8}
                                alt=""
                            />
                            <p className="pl-2">Company Url</p>
                        </div>
                        <button>
                            <Image
                                src={'/eye.svg'}
                                width={15}
                                height={15}
                                alt=""
                            />
                        </button>
                    </div>
                </div><br />

            </div>
        </div>
    )
}

export default ViewOptions;