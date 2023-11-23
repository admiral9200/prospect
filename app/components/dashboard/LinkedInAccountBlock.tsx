import { useState, useEffect } from "react";
import Image from "next/image";

const LinkedInAccountBlock = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isFetched, setIsFetched] = useState<boolean>(false);

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

    useEffect(() => {
        setTimeout(() => {
            setIsFetched(true)
        }, 4000)
    }, [])

    return (
        <div className={`w-full my-2 h-[100px] lg:h-auto lg:w-1/5 lg:min-h-1/4 border-2 px-4 lg:py-4 border-gray-200 rounded-xl flex lg:flex-col ${!isFetched ? 'justify-start' : 'justify-between'} lg:justify-center items-center`}>
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
                    <p>Connect your</p>
                    <p>linkedin account</p>
                </div>
            }
            {
                (!isMobile && !isFetched) &&
                <button
                    className="bg-[#6039DB] rounded-md text-white px-3.5 py-2.5"
                    onClick={() => setIsFetched(true)}
                >
                    Connect Now
                </button>
            }

            {
                (isFetched && !isMobile) &&
                <div className="rounded-full flex justify-center items-center space-x-2 border-[1px] border-gray-200 px-2.5 py-1.5">
                    <p className="font-semibold">Morikawa Dakeshi</p>
                    <Image
                        src={'/avatar-17.png'}
                        width={30}
                        height={30}
                        alt=''
                        className="rounded-full"
                    />
                </div>
            }

            {
                (!isFetched && isMobile) &&
                <p className="font-semibold">Only available on desktop</p>
            }
            {
                (isFetched && isMobile) &&
                <div className="flex justify-center items-center space-x-2">
                    <p className="font-semibold">Morikawa Dakeshi</p>
                    <Image
                        src={'/avatar-17.png'}
                        width={30}
                        height={30}
                        alt=''
                        className="rounded-full"
                    />
                </div>
            }
        </div>
    )
}

export default LinkedInAccountBlock;