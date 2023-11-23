import { Fragment, useState } from 'react'
import {
    FaceFrownIcon,
    FaceSmileIcon,
    FireIcon,
    HandThumbUpIcon,
    HeartIcon,
    PaperClipIcon,
    XMarkIcon,
} from '@heroicons/react/20/solid'
import { Listbox, Transition } from '@headlessui/react'
import Image from 'next/image'

const moods = [
    { name: 'Excited', value: 'excited', icon: FireIcon, iconColor: 'text-white', bgColor: 'bg-red-500' },
    { name: 'Loved', value: 'loved', icon: HeartIcon, iconColor: 'text-white', bgColor: 'bg-pink-400' },
    { name: 'Happy', value: 'happy', icon: FaceSmileIcon, iconColor: 'text-white', bgColor: 'bg-green-400' },
    { name: 'Sad', value: 'sad', icon: FaceFrownIcon, iconColor: 'text-white', bgColor: 'bg-yellow-400' },
    { name: 'Thumbsy', value: 'thumbsy', icon: HandThumbUpIcon, iconColor: 'text-white', bgColor: 'bg-blue-500' },
    { name: 'I feel nothing', value: null, icon: XMarkIcon, iconColor: 'text-gray-400', bgColor: 'bg-transparent' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const TextArea = ({profile, handleProfile}) => {
    const [selected, setSelected] = useState(moods[5])

    return (
        <div className="w-full flex items-start">
            <div className="min-w-0 flex-1">
                <div className="relative">
                    <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-1 focus-within:ring-indigo-600">
                        <label htmlFor="comment" className="sr-only">
                            Add your comment
                        </label>
                        <textarea
                            value={profile.value}
                            name="value"
                            onChange={(e) => handleProfile(e)}
                            rows={12}
                            id="comment"
                            className="block w-full resize-none border-[1.5px] border-gray-200 bg-transparent p-3  text-black placeholder:text-gray-900 sm:text-sm sm:leading-6"
                            placeholder="I am going to get a job & might be a bigger sentence and goes up to two lines"
                            defaultValue={''}
                        />
                    </div>
                    <div className='w-full absolute bottom-0 p-3 border-t-2 border-gray-200'>
                        <button 
                            className='mr-4'
                            onClick={e => e.preventDefault()}
                        >
                            <Image
                                src={'/account_settings/under_T.svg'}
                                width={10}
                                height={10}
                                alt=''
                            />
                        </button>
                        <button>
                            <Image
                                src={'/account_settings/pin.svg'}
                                width={12}
                                height={12}
                                alt=''
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TextArea;