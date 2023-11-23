import { useState, useEffect } from "react";
import Image from "next/image";
import ContactModal from "./ContactModal";
import ContactTable from "./ContactTable";


export default function MainContent({ step, open, setOpen }) {
    const [isMobile, setIsMobile] = useState(false);

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


    return (
        <div className="w-full h-full relative lg:px-4">
            <div className="w-full h-full sm:w-full sm:m-0 sm:p-0 absolute top-[50%] left-[50%] translate-x-[-50%] ">
                <ContactModal setOpen={setOpen} open={open} />
            </div>
            <div className="flex justify-between items-center px-4 lg:mt-12">
                <h2 className="font-bold text-[26px]">My Contacts</h2>
                <div className="flex justify-center items-center">
                    <div className="fixed top-3 flex justify-center items-center sm:relative sm:mr-4 sm:mb-4">
                        <Image
                            src={'/Objects.svg'}
                            width={20}
                            height={20}
                            alt=""
                        />
                        { !isMobile && <span className="">Available Credits: </span> }
                        <span className="pl-4">543</span>
                    </div>
                    {
                        !isMobile &&
                        <button
                            className="border-[1px] bg-[#ece7fb] rounded-2xl py-4 w-[250px] "
                            onClick={() => setOpen(!open)}
                        >
                            <div className="flex justify-center items-center">
                                <Image
                                    src={'/download.svg'}
                                    width={20}
                                    height={20}
                                    alt="font-bold"
                                />
                                <p className="pl-4 font-bold">Import Contacts</p>
                            </div>
                        </button>
                    }
                    {
                        isMobile &&
                        <button
                            className='translate-y-16 text-[#6039DB] bg-[#F0ECFC] py-2 px-4 rounded-md font-semibold text-[14px]'
                            onClick={() => { setOpen(true) }}

                        >
                            Import
                        </button>
                    }

                </div>
            </div>
            {/* table part start */}
            <ContactTable isMobile={isMobile} />
            {/* table part end */}
        </div>
    )
}