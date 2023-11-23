import Image from "next/image"
import { CheckCircleIcon } from '@heroicons/react/20/solid'

export default function ConnectorButton({ title, url, setConnectionState, isConnected }) {
    return (
        <div className='relative w-[192px] h-[192px] bg-gray-100 border-[1px] shadow-md rounded-md flex flex-col justify-center items-center hover:bg-gray-200 hover:shadow-lg'>
            <div className='mb-12 flex justify-center '>
                <Image
                    src={url}
                    alt='Connector'
                    width={ title == "Gmail" ? 260 : 120 }
                    height={50}
                    className={ title == "Gmail" ? 'px-6' : '' }
                />
                <p className='pl-2 font-bold text-[20px] text-indigo-600'></p>
            </div>
            <button
                type="button"
                className="absolute bottom-2 inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => setConnectionState(true)}
            >
                { !isConnected ? 'Connect' : 'Connected!' }
                <CheckCircleIcon className={`-mr-0.5 h-5 w-5 ${!isConnected ? ' hidden' : ''}`} aria-hidden="true" />
            </button>
        </div>
    )
}