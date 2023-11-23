import Image from 'next/image'

const Tab = ({ title, description, src, onToggle, isToggled }) => {
    return <div className="flex flex-col bg-white">

        <div className="bg-white pt-3 pb-0 flex-col items-center flex-grow overflow-y-auto">
            <div className="flex flex-col items-center mx-auto">
                <div className={`w-full mx-auto bg-white rounded-md border ${isToggled ? 'border-purple-700' : 'border-gray-300'} divide-y divide-gray-200`}>

                    <div
                        className={`p-4 flex justify-between rounded-t-md cursor-pointer items-center h-16 ${isToggled ? 'bg-purple-50' : ''}`}
                        onClick={onToggle}
                    >
                        <div className="flex items-center">
                            <div
                                className={`relative h-6 w-6 rounded-full border ${(isToggled) ? 'border-purple-700' : 'border-gray-400'} mr-2 flex-shrink-0`}>
                                {(isToggled) &&
                                    <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-purple-700"></span>}
                            </div>
                            <div
                                className={`relative h-8 w-8 mr-2 flex-shrink-0`}>
                                <Image
                                    src={src}
                                    width={50}
                                    height={50}
                                    alt="icon png"
                                />
                            </div>

                            <div className='ml-2'>
                                <h4 className="text-md font-semibold">{title}</h4>
                                <p className='text-sm sm:flex hidden'>{description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
}
export default Tab