import { useState, useEffect } from "react";

interface TopStepBarProps {
    step: number
}

const TopStepBar = ({ step }: TopStepBarProps) => {
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
        <div className="px-4 flex justify-between lg:justify-center items-center pt-4">
            <div className="flex flex-col lg:flex-row lg:justify-center items-center">
                <div className="w-6 h-6 rounded-full bg-[#6039DB] border-1 border-gray-300 text-white flex items-center justify-center">
                    <p>1</p>
                </div>
                <p className="font-semibold px-2 pt-2 text-[12px] lg:text-md">
                    Add Contacts
                </p>
            </div>
            <p className="text-gray-200">------</p>
            <div className="flex flex-col lg:flex-row justify-center items-center py-2 lg:pl-4">
                <div className={`w-6 h-6 rounded-full ${step == 4 ? 'bg-[#6039DB] text-white' : 'bg-white'} border-2 border-gray-300 text-black flex items-center justify-center`}>
                    <p>2</p>
                </div>
                <p className="px-2 pt-2 text-[12px] lg:text-md">
                    { isMobile ? 'Add Action' : 'Build Sequence' }
                </p>
            </div>
            <p className="text-gray-200">------</p>
            <div className="flex flex-col lg:flex-row justify-center items-center lg:pl-4">
                <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300 text-black flex items-center justify-center">
                    <p>3</p>
                </div>
                <p className="px-2 pt-2 text-[12px] lg:text-md">
                    { isMobile ? 'Analytics' : 'Launch & Analytics' }
                </p>
            </div>
        </div>
    )
}

export default TopStepBar;