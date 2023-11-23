import { useState, useEffect } from "react";
import Image from "next/image";

const VoiceBlock = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isCloned, setIsCloned] = useState<boolean>(false);

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
        <div className="w-full my-2 h-[100px] lg:h-auto lg:w-1/5 lg:min-h-1/4 border-2 px-4 lg:py-4  border-gray-200 rounded-xl flex lg:flex-col justify-between lg:justify-center items-center">
            <div className="w-[50px] h-[50px] lg:w-[100px] lg:h-[100px] rounded-full bg-[#FF8F00] bg-opacity-20 flex flex-col items-center justify-center" >
                {
                    !isCloned &&
                    <Image
                        src={`/dashboard/voice_icon.svg`}
                        width={isMobile ? 20 : 40}
                        height={isMobile ? 20 : 40}
                        alt=''
                    />
                }
                {
                    isCloned && <Image
                        src={`/dashboard/voice_cloned.svg`}
                        width={40}
                        height={40}
                        alt=''
                    />
                }
            </div>
            {
                <>
                    <div className="hidden lg:block font-semibold my-8 text-center">
                        <p>Clone your voice</p>
                        <p>with AI</p>
                    </div>
                    {
                        (!isCloned && !isMobile) &&
                        <button 
                        className="bg-[#6039DB] rounded-lg px-3.5 py-2.5 text-white"
                        onClick={e => setIsCloned(true)}
                    >
                        Make your voice
                    </button>
                    }
                </>
            }

            {
                (isCloned && !isMobile) && 
                <Image 
                    src={'/dashboard/player_icon.svg'}
                    width={40}
                    height={40}
                    alt=""
                    className="rounded-full"
                />
            }

            {
                (!isCloned && isMobile) &&
                <button
                    className="bg-[#6039DB] bg-opacity-10 font-semibold rounded-lg px-3.5 py-2.5 text-[#6039DB]"
                    onClick={() => { setTimeout(() => { setIsCloned(!isCloned) }, 2000) }}
                >
                    Clone voice
                </button>
            }
            {
                (isCloned && isMobile) &&
                <div className="border-[1.5px] border-gray-200 flex justify-between items-center rounded-full px-3 py-1.5 font-semibold space-x-2">
                    <p>Play audio</p>
                    <Image
                        src={'/dashboard/player_icon.svg'}
                        width={20}
                        height={20}
                        alt=""
                    />
                </div>
            }
        </div>
    )
}

export default VoiceBlock;