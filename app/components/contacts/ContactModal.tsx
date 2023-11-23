import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'

export default function ContactModal({ setOpen, open }) {
    const cancelButtonRef = useRef(null)
    const backgroundImageUrl = '/Modal_contact.svg';

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-100 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-8 w-full h-full overflow-y-auto lg:scale-[1.2]">
                    <div className="flex min-h-full w-full items-center justify-center p-4 text-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg scale-[1.3] w-[300px] h-[400px] bg-white text-left shadow-xl transition-all sm:w-min-[300px] sm:my-8 sm:max-w-lg lg:w-[300px] md:w-[300px]">
                                <div className='w-full h-full'>
                                    <Image 
                                        src={backgroundImageUrl}
                                        width={300}
                                        height={100}
                                        alt=''
                                    />
                                    <div className='absolute top-10 left-6 flex flex-col justify-center items-center mt-20'>
                                        <p className='font-bold text-[24px]'>25 profiles selected</p>
                                        <p className='text-[14px] opacity-80 my-4'>25 profiles have a linkedin URL</p>
                                        <div className="flex justify-center items-center scale-75">
                                            <Image 
                                                src={'/Objects.svg'}
                                                width={20}
                                                height={20}
                                                alt=""
                                            />
                                            <span className="mx-4">Available Credits: </span>
                                            <span className="mx-4">543</span>
                                        </div>
                                    </div>
                                    <div className='absolute top-10 left-0 mt-52 px-2'>
                                        <Image
                                            src={'/modal_button_1.svg'}
                                            width={300}
                                            height={20}
                                            alt=''
                                        />
                                    </div>
                                    <div className='absolute top-10 left-0 mt-[278px] px-2'>
                                        <Image
                                            src={'/modal_button_1.svg'}
                                            width={300}
                                            height={20}
                                            alt=''
                                        />
                                    </div>
                                    <div className='absolute top-10 mt-[216px] right-[20px] w-full'>
                                        <div className='flex justify-between items-center'>
                                            <div className='scale-[70%] translate-x-28'>
                                                <p className='font-bold text-[14px]'>Find Email</p>
                                                <div className='flex justify-center items-center'>
                                                    <Image
                                                        src={'/Objects.svg'}
                                                        width={15}
                                                        height={215}
                                                        alt=''
                                                    />
                                                    <span className='pl-2 text-[14px]'>25 credits needed</span>
                                                </div>
                                            </div>
                                            <button>
                                                <Image
                                                    src={'/Arrow.svg'}
                                                    width={20}
                                                    height={20}
                                                    alt=''
                                                />
                                            </button>
                                        </div>
                                    </div>
                                    <div className='absolute top-28 mt-[216px] right-[20px] w-full'>
                                        <div className='flex justify-between items-center'>
                                            <div className='scale-[70%] translate-x-28'>
                                                <p className='font-bold text-[14px]'>Find Phone Number</p>
                                                <div className='flex justify-center items-center'>
                                                    <Image
                                                        src={'/Objects.svg'}
                                                        width={15}
                                                        height={215}
                                                        alt=''
                                                    />
                                                    <span className='pl-2 text-[14px]'>25 credits needed</span>
                                                </div>
                                            </div>
                                            <button>
                                                <Image
                                                    src={'/Arrow.svg'}
                                                    width={20}
                                                    height={20}
                                                    alt=''
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}