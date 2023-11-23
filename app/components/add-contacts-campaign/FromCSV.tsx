import Image from "next/image";

const FromCSV = ({ filename }) => {
    return (
        <div className="px-4 flex flex-col w-full justify-start items-start lg:pt-[100px] lg:justify-center lg:items-center lg:w-[450px] lg:mx-auto relative">
            <div className="mt-10 mb-14 lg:text-center">
                <p className="font-bold text-[28px]">Import from CSV</p>
                <p className="pt-2 opacity-80">Some Helping subtile will be added here</p>
            </div>
            <div className="w-full border-dashed border-gray-400 border-2 rounded-2xl px-4 pt-8 pb-2">
                <div className="flex justify-center items-center">
                    <Image
                        src={'/upload_icon.svg'}
                        width={35}
                        height={35}
                        alt=""
                    />
                </div>
                <div className="flex justify-between items-center py-4">
                    <p className="font-semibold">{filename}</p>
                    <button className="text-[#6039DB]">
                        <u>Remove</u>
                    </button>
                </div>
                <div className="bg-[#6039DB] w-full h-[4px] rounded-2xl">

                </div>
            </div>
            <button className="bg-[#6039DB] text-white rounded-xl w-[180px] h-[50px] fixed left-0 right-0 mx-auto bottom-4 lg:absolute lg:bottom-0 lg:translate-y-20">
                Next
            </button>
        </div>
    )
}

export default FromCSV;