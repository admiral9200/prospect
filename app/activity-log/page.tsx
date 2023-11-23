'use client'

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/app/components/ui/navbar';
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import useNotification from '@/app/components/ui/notification';
import { useLayoutEffect, useRef } from 'react'
import SearchBar from '../components/activity-log/SearchBar';

// import fake db...
import { logs } from '../components/activity-log/@faker-db';
import LogItem from '../components/activity-log/LogItem';
import Image from 'next/image';


export default function ActivityLog() {

  const [step, setStep] = useState<number>(1);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const user = useUser();
  const [isUsageLimitReached, setIsUsageLimitReached] = useState(false);
  const [notification, notify] = useNotification();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHideSearchBar, setIsHideSearchBar] = useState<boolean>(true); // to hide and show the search bar in mobile version


  const [campaigns, setCampaigns] = useState<
    Array<{
      campaign_id: number | string;
      campaign_name: string | null;
    }>
  >([]);



  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      if (!user) {
        console.log('no user');
        return; // Early return if no user
      }

      // Fetch campaigns related to the user
      let { data: campaignData, error: campaignError, status: campaignStatus } = await supabase
        .from('campaigns')
        .select(`campaign_name, campaign_id`)
        .eq('user_id', user?.id);

      if (campaignError && campaignStatus !== 406) {
        (notify as (type: string, message: string, description: string) => void)(
          'error',
          'Problem fetching your campaigns',
          'Please refresh the page',
        );
      }


      // Fetch user profile information
      let { data: userData, error: userError } = await supabase
        .from('users')
        .select(`id, user_name, user_linkedinprofile`)
        .eq('id', user?.id);

      if (userError) {
        (notify as (type: string, message: string, description: string) => void)(
          'error',
          'Problem fetching your user data',
          'Please refresh the page',
        );
        console.log(userError)
      }

      // You can set this userData to a state or handle it as needed
      // ...
    } catch (campaignError) {
      alert('Error loading user data!');
    } finally {
      setLoading(false);
    }
  }, [user]);

  //   useEffect(() => {
  //     const { data: authListener } = supabase.auth.onAuthStateChange(
  //       async (event, session) => {
  //         console.log("this is logging session and session.user", session && session.user);
  //         if (session && session.user) {
  //           getProfile();
  //         } 
  //         else {
  //           router.push('/login');
  //         }
  //       }
  //     );

  //     // Cleanup function: removes the listener when the component is unmounted
  //     return () => {
  //       authListener.subscription.unsubscribe();
  //     };
  //   }, [getProfile, supabase.auth, router, user]);

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
    <div className='w-full'>
      {notification as JSX.Element}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} modalOpen={open} step={step} />
      {!sidebarOpen &&
        <main className={`h-auto min-h-screen relative`}>
          <section className='lg:pl-72'>
            <div className='p-4 lg:p-12'>
              <div className='flex justify-between items-center'>
                <h1 className='font-bold text-[20px] lg:text-[32px]'>Activity Log</h1>
                {
                  !isMobile && <SearchBar />
                }
                {
                  (isMobile && isHideSearchBar) &&
                  <button
                    className='flex justify-center items-center'
                    onClick={() => setIsHideSearchBar(!isHideSearchBar)}
                  >
                    <Image
                      src={'/search.svg'}
                      width={12}
                      height={12}
                      alt=''
                    />
                    <p className='pl-2'>Search</p>
                  </button>
                }

              </div>
              {/* in mobile version, to show or hide the search bar when clicking the above search button */}
              <div className='mt-4'>
                {
                  (isMobile && !isHideSearchBar) &&
                  <SearchBar />
                }
              </div>


              <div className='overflow-x-auto w-full'>
                {/* logs start */}
                <div className='border-[3px] border-gray-200 pt-8 pl-8 pr-6 lg:pr-20 pb-8 rounded-md font-semibold mt-8 min-w-[1000px]'>
                  <div className='flex justify-between items-center text-[18px]'>
                    <div className='flex justify-center items-center '>
                      <p>Time</p>
                      <p className='pl-[150px] lg:pl-[500px]'>Actions</p>
                    </div>
                    <p className='w-[200px] lg:w-[300px]'>Done by</p>
                  </div>
                  {
                    logs.map((log: any) => (
                      <LogItem key={log.id} log={log} />
                    ))
                  }

                  {/* separator start */}
                  <div className='flex justify-between items-center'>
                    <div className='w-full h-[1px] bg-gray-100'></div>
                    <p className='opacity-30 uppercase mx-4 text-[12px]' >Yesterday</p>
                    <div className='w-full h-[1px] bg-gray-100'></div>
                  </div>
                  {/* separator end */}

                  {
                    logs.map((log: any) => (
                      <LogItem key={log.id} log={log} />
                    ))
                  }

                  {/* separator start */}
                  <div className='flex justify-between items-center'>
                    <div className='w-full h-[1px] bg-gray-100'></div>
                    <p className='opacity-30 mx-4 text-[12px] w-[250px] text-center' >Date comes here</p>
                    <div className='w-full h-[1px] bg-gray-100'></div>
                  </div>
                  {/* separator end */}

                </div>
                {/* logs end */}
              </div>
            </div>
          </section>
        </main>
      }
    </div>
  );
}