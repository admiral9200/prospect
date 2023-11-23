import { useState, useEffect } from "react";
import Image from "next/image";

const AccountBlock = () => {
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
        <div className="w-full h-[100px] lg:h-auto lg:w-[400px] lg:min-h-[300px] border-2 px-4 lg:py-4  border-gray-200 rounded-xl flex lg:flex-col justify-between lg:justify-center items-center">
            <div className="w-[50px] h-[50px] lg:w-[100px] lg:h-[100px] rounded-full bg-[#52B5F9] bg-opacity-10 flex flex-col items-center justify-center" >
                <Image
                    src={'/linkedinlogo 1.svg'}
                    width={isMobile ? 20 : 40}
                    height={isMobile ? 20 : 40}
                    alt=''
                />
            </div>
            {
                <div className="hidden lg:block font-semibold my-8 text-center">
                    <p>Clone your voice</p>
                    <p>with AI</p>
                </div>
            }
            <button className="bg-[#6039DB] rounded-lg px-3.5 py-2.5 text-white">
                Connect now
            </button>
        </div>
    )
}

export default AccountBlock;