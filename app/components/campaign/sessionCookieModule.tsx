//app

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import NegativeNotification from '@/app/components/ui/negativeNotification';
import { Transition } from '@headlessui/react';
import { ModuleProps } from './moduleProps';
import {
  useUser, useSupabaseClient
} from '@supabase/auth-helpers-react';
import { useContext } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { CampaignDataContext } from '@/helpers/campaignDataContext';
import useNotification from '@/app/components/ui/notification';

import Image from 'next/image';
import useExport from '@/app/hooks/useExport';
import { useTranslations } from 'next-intl';

const LinkedInModule: React.FC<ModuleProps> = ({ module, isOpen, onToggle, campaignId }) => {

  const t = useTranslations('common')
  const isExport = useExport()
  const supabase = useSupabaseClient();
  const [notification, notify] = useNotification();


  const [li_at, setLi_at] = useState('Paste your li_at cookie here...');
  const [JSESSIONID, setJSESSIONID] = useState('Paste your JSESSIONID cookie here...');
  const [li_a, setLi_a] = useState('')
  const [liap, setLiap] = useState('')
  const [showCookieNotification, setShowCookieNotification] = useState(false);
  const user = useUser()
  const li_atRef = useRef(null);
  const JSESSIONIDRef = useRef(null);
  const router = useRouter();

  const context = useContext(CampaignDataContext)!;
  const { fetchCampaignData } = context;

  const fetchUserData = async () => {
    const { data: campaignData, error: campaignError } = await supabase
      .from(isExport ? 'csv_campaigns' : 'campaigns')
      .select('user_linkedin_id')
      .eq('campaign_id', campaignId)
      .single();

    if (campaignError) {
      console.error('Error fetching campaign data', campaignId);
      return;
    }

    // If user_linkedin_id exists in the campaign table, return it
    if (campaignData && campaignData.user_linkedin_id) {
      return { data: { id: campaignData.user_linkedin_id } };
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('user_linkedinprofile')
      .eq('id', user?.id)
      .single();

    if (userError) {
      console.error('Error fetching user data', user?.id);
      return;
    }

    const userLinkedinProfileURL = userData.user_linkedinprofile;
    const cookie = {
      li_at: li_at,
      ajax: JSESSIONID,
      li_a: li_a,
      liap: liap
    }

    const response = await fetch("/api/scrapeProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: userLinkedinProfileURL, cookie }),
    });

    if (response.headers.get("Content-Type") === "application/json") {
      const data = await response.json();
      console.log(data);
      return data;
    } else {
      console.error(await response.text());
      return null;
    }
  };


  const updateSessionCookies = async (newLi_at: string, newJSESSIONID: string, newLi_a?: any, newLiap?: any) => {
    setLi_at(newLi_at);
    setJSESSIONID(newJSESSIONID);
    setLi_a(newLi_a)
    setLiap(newLiap)

    const response = await fetchUserData();
    if (response) {
      const { error: updateUserError } = await supabase
        .from('users')
        .update({ user_linkedin_id: response.data.id })
        .eq('id', user?.id);

      const { error: updateCampaignError } = await supabase
        .from(isExport ? 'csv_campaigns' : 'campaigns')
        .update({ user_linkedin_id: response.data.id })
        .eq('campaign_id', campaignId);

      if (updateUserError) {
        console.error('Error updating user profile id:', updateUserError);
      }

      if (updateCampaignError) {
        console.error('Error updating campaign profile id:', updateCampaignError);
      }
    }
  };




  useEffect(() => {
    // Fetch the data on component mount
    const fetchSessionCookies = async () => {
      let { data, error } = await supabase
        .from(isExport ? 'csv_campaigns' : 'campaigns')
        .select('li_at, jsessionid, liap, li_a')
        .eq('campaign_id', campaignId)
        .single();

      if (error) {
        console.log('Error fetching session cookies:', error);
      } else if (data) {
        setLi_at(data.li_at || 'Paste your li_at cookie here...');
        setJSESSIONID(data.jsessionid || 'Paste your JSESSIONID cookie here...');
      }
    };

    fetchSessionCookies();
  }, []); // Adding an empty dependency array to run only on component mount


  useEffect(() => {
    const handleCookiesReceived = async (event: any) => {
      console.log('Cookies received event triggered!');
      const cookies = event.detail;
      console.log(cookies);
      // if (!('liap' in cookies)) {        
      //   (notify as (type: string, message: string, description: string) => void)(
      //     'Warning',
      //     'Please upgrade the extension to the latest version',
      //     ''
      //   );
      //   setTimeout(() => {
      //     window.open('https://chrome.google.com/webstore/detail/prospai/cnjgocodmpidbhdgihjnfgbcbeikkkcn', '_blank');
      //   }, 2000);
      // }

      setLi_at(cookies.li_at);
      setJSESSIONID(cookies.JSESSIONID);
      setLi_a(cookies.li_a || null)
      setLiap(cookies.liap)
      // if (!cookies.li_a) {
      //   (notify as (type: string, message: string, description: string) => void)(
      //     'warning',
      //     'Ensure that you possess the necessary access to Sales Navigator',
      //     ''
      //   );
      // }


      if (cookies.li_at !== "No cookie found" && cookies.JSESSIONID !== "No cookie found") {
        if (timer) {
          clearTimeout(timer);
        }

        await updateCampaignSessionCookies(cookies.li_at, cookies.JSESSIONID, cookies.li_a, cookies.liap);
      }

      if (context) {
        fetchCampaignData();
      }
    };
    window.addEventListener('cookiesReceived', handleCookiesReceived);
    return () => {
      window.removeEventListener('cookiesReceived', handleCookiesReceived);
    };
  }, []);

  useEffect(() => {
    console.log(li_a);
  }, [li_a])




  useEffect(() => {
    if (
      li_at !== '' &&
      li_at !== 'Paste your li_at cookie here...' &&
      JSESSIONID !== '' &&
      JSESSIONID !== 'Paste your JSESSIONID cookie here...'
    ) {
      updateSessionCookies(li_at, JSESSIONID, li_a, liap);
    }
  }, [li_at, JSESSIONID, li_a, liap]);

  const updateCampaignSessionCookies = async (newLi_at: string, newJSESSIONID: string, newLi_a?: string, newLiap?: string) => {

    const { error } = await supabase
      .from(isExport ? 'csv_campaigns' : 'campaigns')
      .update({ li_at: newLi_at, jsessionid: newJSESSIONID, li_a: newLi_a, liap: newLiap })
      .eq('campaign_id', campaignId);

    if (error) {
      console.log('Error updating session cookies:', error);
    }
  };

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const handleButtonClick = () => {
    try {
      window.dispatchEvent(new CustomEvent('getCookies'));
      setTimer(setTimeout(() => {
        if (!li_at || !JSESSIONID ||
          li_at === 'Paste your li_at cookie here...' ||
          JSESSIONID === 'Paste your JSESSIONID cookie here...') {
          setShowCookieNotification(true);
          window.open('https://chrome.google.com/webstore/detail/prospai/cnjgocodmpidbhdgihjnfgbcbeikkkcn', '_blank');
        }
      }, 6000)); // wait for 2 seconds
    } catch (error) {
      console.error("An error occurred:", error);
      // Add any other error handling you want here
      window.open('https://chrome.google.com/webstore/detail/prospai/cnjgocodmpidbhdgihjnfgbcbeikkkcn', '_blank');
    }
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [li_at, JSESSIONID, timer]);



  return (
    <div>
      {notification as JSX.Element}
      <div
        className={`p-4 flex justify-between rounded-t-md cursor-pointer items-center h-16 ${isOpen ? 'bg-gray-50' : ''}`}
        onClick={onToggle}
      >
        <div className="flex items-center">
          <div
            className={`relative h-7 w-7 rounded-full border 
    ${(li_at !== '' && li_at !== 'Paste your li_at cookie here...' &&
                JSESSIONID !== '' && JSESSIONID !== 'Paste your JSESSIONID cookie here...') ? 'border-purple-700' : 'border-gray-400'} mr-2 flex-shrink-0`}>
            {(li_at && li_at !== '' && li_at !== 'Paste your li_at cookie here...' &&
              JSESSIONID && JSESSIONID !== '' && JSESSIONID !== 'Paste your JSESSIONID cookie here...') &&
              <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-purple-700"></span>}
          </div>

          <div className='ml-2'>
            <h4 className="text-md font-semibold">{module.title}</h4>
            <p className='text-sm sm:flex hidden'>{module.description}</p>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <Transition
        show={isOpen}
        enter="transition duration-200"
        enterFrom="opacity-0 transform scale-95"
        enterTo="opacity-100 transform scale-100"
        leave="transition duration-200"
        leaveFrom="opacity-100 transform scale-100"
        leaveTo="opacity-0 transform scale-95"
      >
        <div className="px-4 py-4">
          <div className="bg-blue-100 text-blue-700 p-4 rounded-md  flex items-start">
            <InformationCircleIcon className="h-6 w-6 mr-2 flex-shrink-0 text-blue-700" />
            <p className='text-sm'>
             {t('linkedin_session_module_refresh')}
            </p>          </div>
          <div className="relative flex flex-col items-start mt-4">
            <div
              className="border border-gray-300 p-3 h-12 text-sm w-full rounded-md mb-2 focus:outline-violet-600 inline-block hidden"
              style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              contentEditable
              suppressContentEditableWarning
              onPaste={e => {
                e.preventDefault();
                const pasteData = e.clipboardData.getData('text');
                setLi_at(pasteData);
              }}
              onInput={e => {
                // Prevent user from typing or deleting, always keep the state value
                e.currentTarget.textContent = li_at;
              }}
              onClick={e => {
                if (li_at === 'Paste your li_at cookie here...') {
                  setLi_at('');
                }
              }}
              onBlur={e => {
                if (!li_at.trim()) {
                  setLi_at('Paste your li_at cookie here...');
                }
              }}
            >
              {li_at}
            </div>

            <div
              className="border border-gray-300 p-3 h-12 text-sm w-full rounded-md mb-2  focus:outline-violet-600 inline-block hidden"
              style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              contentEditable
              suppressContentEditableWarning
              onPaste={e => {
                e.preventDefault();
                const pasteData = e.clipboardData.getData('text');
                setJSESSIONID(pasteData);
              }}
              onInput={e => {
                // Prevent user from typing or deleting, always keep the state value
                e.currentTarget.textContent = JSESSIONID;
              }}
              onClick={e => {
                if (JSESSIONID === 'Paste your JSESSIONID cookie here...') {
                  setJSESSIONID('');
                }
              }}
              onBlur={e => {
                if (!JSESSIONID.trim()) {
                  setJSESSIONID('Paste your JSESSIONID cookie here...');
                }
              }}
            >
              {JSESSIONID}
            </div>

            <button className="shrink-0 bg-blue-700 h-16 w-full text-white font-medium text-md p-2 rounded-md flex items-center justify-center" onClick={handleButtonClick}>
              <Image className='mr-4' src="/linkedinlogo.svg" alt="LinkedIn Logo" width={24} height={24} />
             {t('linkedin_session_module_connect')}
              {/* Use the next.js Image component */}

            </button>
            {(li_at !== 'Paste your li_at cookie here...' && JSESSIONID !== 'Paste your JSESSIONID cookie here...') && (
              (li_at && JSESSIONID) ? <div className="shrink-0 flex items-center justify-center w-full mt-4">
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                <span className='ml-2'>{t('linkedin_session_module_success')}</span>
              </div> : null
            )}
          </div>
        </div>
        <NegativeNotification
          show={showCookieNotification}
          setShow={setShowCookieNotification}
          message="Refresh the page after downloading the extension and make sure you are connected to LinkedIn"
          messageType="Error getting the Session Cookie"
        />
      </Transition >
    </div >
  );
};

export default LinkedInModule;
