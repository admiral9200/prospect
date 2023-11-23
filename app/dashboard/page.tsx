'use client'

import { useState, useEffect } from "react"
import dynamic from "next/dynamic";

import Navbar from '@/app/components/ui/navbar';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import Dropdown from '../components/dashboard/Dropdown';
import InfoBlock from '../components/dashboard/InfoBlock';
import Image from 'next/image';
import AccountBlock from '../components/dashboard/AccountBlock';
import LinkedInAccountBlock from "../components/dashboard/LinkedInAccountBlock";
import VoiceBlock from "../components/dashboard/VoiceBlock";
import DomainBlock from "../components/dashboard/DomainBlock";
import MailBlock from "../components/dashboard/MailBlock";

let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// Client Components
const ChartComponent = dynamic(() => import("../components/dashboard/ChartComponent"))

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {!sidebarOpen &&
        <main className="lg:pl-72 lg:overflow-x-auto w-full">
          <div className='px-4 lg:p-8 lg:min-w-[1400px]'>
            <div className='w-full  flex flex-col justify-between items-center'>

              {/* 1. top bar start */}
              <div className="w-full flex justify-between items-center pl-4 border-t-2 border-gray-300 sm:border-t-0 md:border-t-0 lg:border-t-0">
                <div className='flex justify-start items-center min-w-[300px] pt-4'>
                  <p className='mr-4'>Show results: </p>
                  <Dropdown />
                </div>
                {
                  !isMobile && <div className='text-right'>
                    <button className='px-3.5 py-2.5 rounded-lg text-white bg-[#6039DB] '>Create a Campaign</button>
                  </div>
                }
                {
                  isMobile &&
                  <div className='text-right absolute right-4 top-4'>
                    <button className='px-3.5 py-2.5 rounded-lg bg-[#6039DB] bg-opacity-10 text-[#6039DB] min-w-[200px]'>Create a Campaign</button>
                  </div>
                }
              </div>
              {/* 1. top bar end */}

              {/* 2. blocks start */}
              <div className="overflow-x-auto w-full mt-8">
                <div className="flex justify-between items-center ">
                  <InfoBlock 
                    bgColor="#6039DB" 
                    title="Linkedin request" 
                    count={760} 
                    imgUrl="/dashboard/linkedin_req_icon.svg" 
                    percent={8} 
                  />
                  <InfoBlock 
                    bgColor="#52B5F9" 
                    title="Email Sent" 
                    count={760} 
                    imgUrl="/dashboard/mail_sent_icon.svg" 
                    percent={10} 
                  />
                  {/* TODO: change color of this */}
                  <InfoBlock 
                    bgColor="#6039DB" 
                    title="Email Delivered" 
                    count={760} 
                    imgUrl="/dashboard/mail_delivered_icon.svg" 
                    percent={10} 
                  />
                  <InfoBlock 
                    bgColor="#52B5F9" 
                    title="Email Opened" 
                    count={760} 
                    imgUrl="/dashboard/mail_opened_icon.svg" 
                    percent={6} 
                  />
                </div>
              </div>

              {/* 2. blocks end */}

              {/* 3. chart and recent logs start */}
              <div className="w-full lg:grid lg:grid-cols-4 gap-4 mt-8 mb-[40px]">
                <div className='col-span-3 hidden rounded-xl md:hidden lg:block w-full'>
                  <ChartComponent />
                </div>
                <div className='col-span-1 w-full flex justify-center items-center'>
                  <div className="relative border-[2.5px] border-gray-200  p-4 rounded-xl w-[400px]">
                    {/* blur and see all button stat */}
                    <div className="absolute opacity-90 bg-gray-50 w-full blur-sm h-16 bottom-2 left-0 right-0 mx-auto"></div>
                    <button 
                      className="z-10 absolute bottom-5 text-[12px] left-0 right-0 mx-auto font-semibold underline text-[#6039DB]"
                    >
                      See all
                    </button>
                    {/* blur and see all button end */}
                    <p className="font-bold text-[16px]">
                      Recent logs
                    </p>
                    <div className="flex justify-between font-semibold items-center pt-4 pb-2 text-[15px]">
                      <p>Actions</p>
                      <p>Time</p>
                    </div>
                    <div className="">
                      <ul className="text-[15px] font-semibold">
                        <li className="py-2 lg:py-[15px]">
                          <div className="flex justify-between items-center">
                            <div className="flex justify-start items-center">
                              <Image
                                src={'/avatar-17.png'}
                                width={30}
                                height={30}
                                alt=''
                                className="rounded-full"
                              />
                              <p className="pl-2">
                                Email sent to <u>Colin</u>
                              </p>
                            </div>
                            <p>2 hr ago</p>
                          </div>
                        </li>
                        <li className="py-2 lg:py-[15px]">
                          <div className="flex justify-between items-center">
                            <div className="flex justify-start items-center">
                              <Image
                                src={'/avatar-17.png'}
                                width={30}
                                height={30}
                                alt=''
                                className="rounded-full"
                              />
                              <p className="pl-2">
                                Email sent to <u>Colin</u>
                              </p>
                            </div>
                            <p>2 hr ago</p>
                          </div>
                        </li>
                        <li className="py-2 lg:py-[15px]">
                          <div className="flex justify-between items-center">
                            <div className="flex justify-start items-center">
                              <Image
                                src={'/avatar-17.png'}
                                width={30}
                                height={30}
                                alt=''
                                className="rounded-full"
                              />
                              <p className="pl-2">
                                Email sent to <u>Colin</u>
                              </p>
                            </div>
                            <p>2 hr ago</p>
                          </div>
                        </li>
                        <li className="py-2 lg:py-[15px]">
                          <div className="flex justify-between items-center">
                            <div className="flex justify-start items-center">
                              <Image
                                src={'/avatar-17.png'}
                                width={30}
                                height={30}
                                alt=''
                                className="rounded-full"
                              />
                              <p className="pl-2">
                                Email sent to <u>Colin</u>
                              </p>
                            </div>
                            <p>2 hr ago</p>
                          </div>
                        </li>
                        <li className="py-2 lg:py-[15px]">
                          <div className="flex justify-between items-center">
                            <div className="flex justify-start items-center">
                              <Image
                                src={'/avatar-17.png'}
                                width={30}
                                height={30}
                                alt=''
                                className="rounded-full"
                              />
                              <p className="pl-2">
                                Email sent to <u>Colin</u>
                              </p>
                            </div>
                            <p>2 hr ago</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* 3. chart end recent logs end*/}

              {/* 4. Set up account start */}
              <div className="mt-4 w-full">
                <p className="font-bold text-[24px] mb-4">
                  Set up your account
                </p>
                <div className="flex flex-col justify-center lg:flex-row lg:justify-between items-center w-full">
                  <LinkedInAccountBlock />
                  <VoiceBlock />
                  <DomainBlock />
                  <MailBlock />
                </div>
              </div>
              {/* 4. Set up account end */}
            </div>
          </div>
        </main>
      }
    </div>
  );

}