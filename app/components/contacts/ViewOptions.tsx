import Image from "next/image"

interface ViewOptionsProps {
    visible: boolean,
    hideOrShowColumn: any,
    columns: any
}

const ViewOptions = ({ visible, columns, hideOrShowColumn }: ViewOptionsProps) => {

    return (
        <div className={`${visible ? 'absolute z-[9999] right-[-20px] top-8 bg-white w-[250px] h-auto shadow-2xl rounded-2xl' : 'hidden'}`}>
            <div>
                <h4 className="pl-4 pt-3 mb-3 font-bold text-lg">View Option</h4>
            </div>
            {
                columns.filter((col: any) => col.label != '').map((col: any) => {
                    return (
                        <>
                            <div
                                className="inline-block px-4 py-2 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                                onClick={() => { }}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex justify-center items-center">
                                        {/* <Image
                                            src={'/Union.svg'}
                                            width={8}
                                            height={8}
                                            alt=""
                                        /> */}
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
            <div>
                <div className="my-4">
                    <p className="px-4 py-2">Hidden</p>
                    <div className="border-b-2 border-gray-200 w-[90%] m-auto"></div>
                </div>
                <button
                    className="px-4 py-2 opacity-60 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onClick={() => { }}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex justify-center items-center">
                            {/* <Image
                                src={'/Union.svg'}
                                width={8}
                                height={8}
                                alt=""
                            /> */}
                            <p className="pl-2">Country code</p>
                        </div>
                        <Image
                            src={'/eye.svg'}
                            width={15}
                            height={15}
                            alt=""
                        />
                    </div>
                </button><br />
                <button
                    className="px-4 py-2 opacity-60 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onClick={() => { }}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex justify-center items-center">
                            {/* <Image
                                src={'/Union.svg'}
                                width={8}
                                height={8}
                                alt=""
                            /> */}
                            <p className="pl-2">Skills</p>
                        </div>
                        <Image
                            src={'/eye.svg'}
                            width={15}
                            height={15}
                            alt=""
                        />
                    </div>
                </button><br />
                <button
                    className="px-4 py-2 opacity-60 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onClick={() => { }}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex justify-center items-center">
                            {/* <Image
                                src={'/Union.svg'}
                                width={8}
                                height={8}
                                alt=""
                            /> */}
                            <p className="pl-2">Sub title</p>
                        </div>
                        <Image
                            src={'/eye.svg'}
                            width={15}
                            height={15}
                            alt=""
                        />
                    </div>
                </button><br />
                <button
                    className="px-4 py-2 opacity-60 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onClick={() => { }}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex justify-center items-center">
                            {/* <Image
                                src={'/Union.svg'}
                                width={8}
                                height={8}
                                alt=""
                            /> */}
                            <p className="pl-2">Headline</p>
                        </div>
                        <Image
                            src={'/eye.svg'}
                            width={15}
                            height={15}
                            alt=""
                        />
                    </div>
                </button><br />
                <button
                    className="px-4 py-2 opacity-60 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onClick={() => { }}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex justify-center items-center">
                            {/* <Image
                                src={'/Union.svg'}
                                width={8}
                                height={8}
                                alt=""
                            /> */}
                            <p className="pl-2">Company Url</p>
                        </div>
                        <Image
                            src={'/eye.svg'}
                            width={15}
                            height={15}
                            alt=""
                        />
                    </div>
                </button><br />

            </div>
        </div>
    )
}

export default ViewOptions;