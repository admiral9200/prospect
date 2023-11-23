import { useState, useEffect } from "react";
import Image from "next/image";

interface InfoBlockProps {
    bgColor: string,
    percent: number,
    title: string,
    count: number,
    imgUrl: string
}
function classNames(...classes: (string | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

const InfoBlock = ({ bgColor, percent, title, count, imgUrl }: InfoBlockProps) => {
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
        <div className={classNames(`bg-[${bgColor}] bg-opacity-10 min-w-[324px] h-[123px] lg:w-[410px] lg:h-[180px] rounded-xl p-6 lg:py-6 lg:px-10 mx-4`)}>
            <div className="mt-2 lg:mt-9">
                <div className="flex justify-between items-center">
                    <p className="lg:text-[18px]">{title}</p>
                    <Image
                        src={imgUrl}
                        width={isMobile ? 30 : 45}
                        height={isMobile ? 30 : 45}
                        alt=""
                    />
                </div>
                <p className="font-bold text-lg lg:text-[26px]">{count}</p>
            </div>
        </div>
    )
}

export default InfoBlock;