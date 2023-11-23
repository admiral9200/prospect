import { useState, useEffect } from "react";
import Image from "next/image";

const DomainBlock = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isDomainAdded, setIsDomainAdded] = useState<boolean>(false);

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
        <div className="w-full my-2 min-h-[100px] lg:h-auto lg:w-1/5 lg:min-h-[290px] border-2 px-4 lg:py-4  border-gray-200 rounded-xl flex lg:flex-col justify-between lg:justify-center items-center">
            {
                !isDomainAdded &&
                <>
                    <div className="w-[50px] h-[50px] lg:w-[100px] lg:h-[100px] rounded-full bg-[#FFE953] bg-opacity-40 flex flex-col items-center justify-center" >
                        <Image
                            src={'/dashboard/domain_icon.svg'}
                            width={isMobile ? 20 : 40}
                            height={isMobile ? 20 : 40}
                            alt=''
                        />
                    </div>
                    {
                        <div className="hidden lg:block font-semibold my-8 text-center">
                            <p>Connect your</p>
                            <p>linkedin account</p>
                        </div>
                    }
                    <button 
                        className={`bg-[#6039DB] ${isMobile ? 'bg-opacity-10 text-[#6039DB]' : 'bg-opacity-100 text-white'} font-semibold rounded-lg px-3.5 py-2.5 `}
                        onClick={() => setTimeout(() => setIsDomainAdded(true), 1500)}
                    >
                        Add Domain
                    </button>
                </>
            }
            {
                isDomainAdded &&
                <div className="font-semibold w-full h-full">
                    <p className="mt-4">Your Domains</p>
                    <div className='mt-3 flex justify-start items-center border-b-[1px] border-gray-200 pb-2 w-full'>
                        <Image
                            src={'/domain.svg'}
                            width={32}
                            height={32}
                            alt=''
                        />
                        <p className='pl-2'>filpkart.com</p>
                    </div>
                    <div className='mt-3 flex justify-start items-center border-b-[1px] border-gray-200 pb-2 w-full'>
                        <Image
                            src={'/domain.svg'}
                            width={32}
                            height={32}
                            alt=''
                        />
                        <p className='pl-2'>filpkart.com</p>
                    </div>
                    <button className="my-4 text-[12px] text-[#6039DB]">See more</button>
                </div>
            }
        </div>
    )
}

export default DomainBlock;