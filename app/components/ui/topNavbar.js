import { Disclosure } from '@headlessui/react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { RoundButton } from './button';
import { useRouter } from 'next/navigation'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function TopNavbar({showButton, title, pushUrl}) {
  const router = useRouter();

  const handleClick = () => {
    router.push(pushUrl);
  }
  
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {() => (
        <>
          <div className="-ml-1 px-2 sm:px-6 lg:ml-2 lg:px-8 flex justify-between">
            <div className="relative flex h-16 justify-start">
              <div className="my-auto flex flex-shrink-0 justify-start">
                <ChevronLeftIcon className="mr-1 mt-2 h-6 text-white" />
                <img
                  className="mt-1 h-8 w-auto"
                  src="/images/logos/chatbot_emoji.svg"
                  alt="Insite chat"
                />
                <p className="px-4 py-2 text-white">Chatbot Setup</p>
              </div>
            </div>
            {/* Add button here */}
            <div className="-mt-[8px] invisible lg:visible md:visible" onClick={handleClick}>
                 { showButton && <RoundButton title={title} isActive={ true } />} 
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
