import Image from "next/image";
import { useState, useEffect } from "react";


export default function UploadFile({ setStep, step }) {
    const [fileName, setFileName] = useState<string>("");
    const [isMobile, setIsMobile] = useState(false);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);

    useEffect(() => {
        const handleWindowResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        // Add event listener to window resize
        window.addEventListener('resize', handleWindowResize);

        // Call the resize handler initially
        handleWindowResize();

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    const handleFileUpload = (event) => {
        const fileInput = event.target;
        const file = fileInput.files[0];
        if (file) {
            const fileName = file.name;
            setFileName(fileName);
        }
    }

    const handleClick = () => {
        console.log(step);
        if(step == 2) {
            setIsCompleted(true);
            setStep(3);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen m-auto w-[400px] px-4 sm:m-auto md:m-auto lg:m-auto ">
            <p className="font-bold text-[24px]">Import Contacts</p>
            <p className="mb-8 opacity-80 text-[14px]">Some Helping subtitle will be added here</p>

            {/* when there is no any file */}
            {
                fileName.length == 0 &&
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full border-[2px] border-gray-300 border-dashed rounded-2xl cursor-pointer hover:bg-gray-50 ${!isMobile ? 'py-6' : ''}`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-5">
                            <div className={`${isMobile ? 'flex items-center justify-center' : 'flex flex-col items-center'}`}>
                                <div>
                                    <Image
                                        src={'/upload_icon_01.svg'}
                                        width={32}
                                        height={32}
                                        alt="font-bold"
                                    />
                                </div>
                                <p className="ml-2 text-md font-semibold flex justify-between items-center text-[#6039DB]">Browse File</p>
                            </div>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" aria-describedby="file_input_help" onChange={handleFileUpload} />
                        {
                            // renderProgressBar()
                        }
                    </label>
                </div>
            }

            {
                fileName.length > 0 && 
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full border-[2px] border-gray-300 border-dashed rounded-2xl cursor-pointer hover:bg-gray-50 ${!isMobile ? 'py-6' : ''}`}>
                        <div className="w-full flex items-center justify-between pt-5 pb-3 px-4">
                            <div className="flex justify-center items-center">
                                <Image 
                                    src={'/checker_01.svg'}
                                    width={20}
                                    height={20}
                                    alt=""
                                />
                                <p className="pl-2">{fileName}</p>
                            </div>
                            <button className="text-[#6039DB]"><u>Remove</u></button>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" aria-describedby="file_input_help" onChange={handleFileUpload} />
                        <div className={`w-[90%] h-[4px] bg-[#6039DB] rounded-md mb-2`}></div>
                    </label>
                </div>
            }

            <p className="my-4 text-[20px] text-black font-semibold">Or</p>

            <button className="w-full flex justify-center items-center bg-[#ece7fb] rounded-2xl text-black">
                <Image
                    src={'/linkedinlogo 1.svg'}
                    width={20}
                    height={20}
                    alt=""
                />
                <p className="text-black py-5 ml-2 font-semibold">Find People from LinkedIn</p>
            </button>
            <button
                className={`mt-8 py-4 w-[180px] rounded-2xl text-white ${fileName.length > 0 ? ' bg-[#6039DB]' : ' bg-[#CBCBCB]'}`}
                onClick={() => { handleClick() }}
            >
                Done
            </button>
        </div>
    )
}