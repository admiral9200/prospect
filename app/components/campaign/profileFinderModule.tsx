import React, { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { ModuleProps } from './moduleProps';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import NegativeNotification from '@/app/components/ui/negativeNotification';
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import useNotification from '@/app/components/ui/notification';
import { useContext } from 'react';
import { CampaignDataContext } from '@/helpers/campaignDataContext';
import Spinner from '@/app/components/ui/spinner';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import useExport from '@/app/hooks/useExport';


const ProfileFinderModule: React.FC<ModuleProps> = ({ module, isOpen, onToggle, campaignId, campaignInfo }) => {
  const t = useTranslations('common')
  const [isUpdated, setisUpdated] = campaignInfo
  const supabase = useSupabaseClient();
  const user = useUser();
  const [inputValue, setInputValue] = useState('');
  const [previousUrl, setPreviousUrl] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notification, notify] = useNotification();
  const [linkedinProfilesExist, setLinkedinProfilesExist] = useState(false);
  const [linkedinProfileUrls, setLinkedinProfileUrls] = useState<string[]>([]);
  const [readyProfiles, setReadyProfiles] = useState<any[]>([]);
  const context = useContext(CampaignDataContext)!;
  const { fetchCampaignData } = context;
  const [liAt, setLiAt] = useState('');
  const [ajax, setAjax] = useState('');
  const [li_a, setLi_a] = useState('')
  const [liap, setLiap] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const isExport = useExport()

  const fetchCampData = async () => {
    let { data: campaigns, error } = await supabase
      .from(isExport ? 'csv_campaigns' : 'campaigns')
      .select('*')
      .eq('campaign_id', campaignId);

    if (error) {
      console.log('Error fetching campaign data:', error);
      return;
    }


    if (campaigns && campaigns.length > 0) {
      console.log('fetchData linkedinProfileUrls', linkedinProfileUrls)
      console.log('fetchCampData linkedinProfileUrls', campaigns[0].linkedin_profiles_url)
      setInputValue(campaigns[0].linkedin_search_url ? campaigns[0].linkedin_search_url : '');
      setLiAt(campaigns[0].li_at);
      setAjax(campaigns[0].jsessionid);
      setLi_a(campaigns[0].li_a);
      setLiap(campaigns[0].liap);
      setPreviousUrl(campaigns[0].linkedin_search_url ? campaigns[0].linkedin_search_url : '');

      // Check if linkedin_profiles_url is not null or undefined
      setLinkedinProfilesExist(campaigns[0].linkedin_profiles_url !== null && campaigns[0].linkedin_profiles_url !== undefined);

      // If linkedin_profiles_url exists and not empty, set it in the state variable
      if (campaigns[0].linkedin_profiles_url !== null && campaigns[0].linkedin_profiles_url !== undefined && campaigns[0].linkedin_profiles_url.length > 0) {
        setLinkedinProfileUrls(campaigns[0].linkedin_profiles_url);
        setReadyProfiles(campaigns[0].ready_profiles || []);
      }

    }
  };

  useEffect(() => {
    (async () => await fetchCampData())()
  }, [isUpdated]);

  useEffect(() => {
    console.log('Updated linkedinProfileUrls', linkedinProfileUrls);
  }, [linkedinProfileUrls]);


  const handleSaveSearch = async () => {
    if (isLoading) return
    setIsLoading(true)
    const isNotSingleProfile = !inputValue.startsWith("https://www.linkedin.com/in/")
    const isNotValidUrl = (
      !inputValue.startsWith("https://www.linkedin.com/search/results/") &&
      !inputValue.startsWith("https://www.linkedin.com/sales/search/people") &&
      isNotSingleProfile
    )
    try {
      // Check if inputValue contains "linkedin.com/search/results/people"
      if (isNotValidUrl) {
        setShowNotification(true);
        return;  // Stop further execution
      }

      console.log('thats the previous url', previousUrl);

      // Check if the previousUrl is different from the current inputValue
      if (previousUrl !== inputValue) {
        const { data: resetData, error: resetError } = await supabase
          .from(isExport ? 'csv_campaigns' : 'campaigns')
          .update({ start: 0 })
          .eq('campaign_id', campaignId);

        if (resetError) {
          console.log('Error resetting start value:', resetError);
          return;
        } else {
          console.log('Successfully reset start value to 0:', resetData);
        }
      }

      // Update linkedin_search_url in the database
      console.log('inputValue', inputValue, isExport);

      const { data, error } = await supabase
        .from(isExport ? 'csv_campaigns' : 'campaigns')
        .update({ linkedin_search_url: inputValue })
        .eq('campaign_id', campaignId);
      if (error) {
        console.log('Error updating search URL:', error);
        throw error;
      }

      console.log('Search URL updated successfully:', data);
      // Fetch the total search results from API        
      isNotSingleProfile ? await handleSearchUrl(inputValue) : await handleSingleProfile(inputValue)


    } catch (error: any) {
      console.log(error);
      (notify as (type: string, message: string, description: string) => void)(
        'error',
        'Error extracting profiles',
        `Some search filters are not yet supported. Try removing some of them`,
      );
    } finally {
      await fetchCampData();
      setIsLoading(false)
    }
  };

  const handleSingleProfile = async (url) => {
    const { data: updatedData, error } = await supabase
      .from(isExport ? 'csv_campaigns' : 'campaigns')
      .update({ total_search_results: 1, start: 1, is_single_profile: true })
      .eq('campaign_id', campaignId)
      .select('*');
    console.log(updatedData, 'updatedData');

    const oldUrls = (updatedData![0].linkedin_profiles_url || []).filter(u => u !== url)

    const new_linkedin_profiles_url = [...oldUrls, url]
    const { data: updateLink, error: linkError } = await supabase
      .from(isExport ? 'csv_campaigns' : 'campaigns')
      .update({ linkedin_profiles_url: new_linkedin_profiles_url })
      .eq('campaign_id', campaignId)
      .select('*');
    console.log(updateLink, 'updateLink');

    if (error) {
      console.log('Error updating total search results:', error);
      throw error
    }
    (notify as (type: string, message: string, description: string) => void)(
      'success',
      t('profile_finder_prosp_extracted'),
      `${t('profile_finder_total_extract_success_pt1')} ${updateLink?.length} profile`,
    );

    if (context) {
      fetchCampaignData();
    }
  }

  const handleSearchUrl = async (url) => {
    const pagination: any = await fetchTotalSearchResults(url);
    const totalSearchResults = pagination.totalSearchResults
    if (totalSearchResults !== null) {
      // console.log(totalSearchResults);
      // Update total_search_results in the database
      const { data: updatedData, error } = await supabase
        .from(isExport ? 'csv_campaigns' : 'campaigns')
        .update({ total_search_results: totalSearchResults, start: pagination?.start, is_single_profile: false })
        .eq('campaign_id', campaignId);

      if (error) {
        console.log('Error updating total search results:', error);
        throw error
      }

      (notify as (type: string, message: string, description: string) => void)(
        'success',
        t('profile_finder_prosp_extracted'),
        `${t('profile_finder_total_extract_success_pt1')} ${totalSearchResults} ${t('profile_finder_total_extract_success_pt2')}`,
      );
    }
  }

  const fetchTotalSearchResults = async (url) => {
    // Prepare body data for the POST request
    const bodyData = {
      url: url,
      cookie: {
        li_at: liAt,
        ajax: ajax,
        li_a: li_a,
        liap: liap,
      }
    };

    // Make a POST request to your API
    const response = await fetch('/api/searchPeoples', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    // If the request was successful
    const data = await response.json();
    if (!response.ok) throw new Error(data);

    // Extract the profile URLs and add them to the existing linkedinProfileUrls array
    // Also ensure that no URL is added twice by using a Set
    let newUrlsSet = new Set(linkedinProfileUrls);
    Object.values(data.data).forEach((profile: any) => {
      if (profile.url && profile.url.startsWith("https://www.linkedin.com/in/")) {
        newUrlsSet.add(profile.url);
      }
    });

    // Create a local copy of the updated array
    let newUrlsArray = Array.from(newUrlsSet);

    // Update the state with the local copy
    setLinkedinProfileUrls(newUrlsArray);

    // Update the linkedin_profiles_url in the database
    const { data: updatedData, error } = await supabase
      .from(isExport ? 'csv_campaigns' : 'campaigns')
      .update({ linkedin_profiles_url: newUrlsArray })
      .eq('campaign_id', campaignId);

    if (error) {
      console.log('Error updating LinkedIn profile URLs:', error);
      return
    } else {
      console.log('LinkedIn profile URLs updated successfully:', updatedData);
      // POST to the API after successful update
      // postProfileToApi(newUrlsArray.slice(0,3));
    }

    if (context) {
      fetchCampaignData();
    }

    console.log(data)
    // Return total_search_results
    return { totalSearchResults: data.data.total_search_results, start: data.data.start }
  };


  const postProfileToApi = async (profiles) => {
    if (user === null) {
      console.error('User is not logged in');
      return;
    }

    console.log("this is the profiles", profiles)
    const bodyData = {
      profiles_urls: profiles,
      cookie: {
        li_at: liAt,
        ajax: ajax
      },
      campaignId: campaignId,
      userId: user.id
    };

    const response = await fetch('/api/scrapProfiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);

      // Call the POST API here
      const postResponse = await fetch('/api/generateResponseCampaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...data, campaignId: campaignId, userId: user.id })
      });

      if (postResponse.ok) {
        const postData = await postResponse.json();
        console.log(postData);

        // Update readyProfiles to only include profiles already in the database
        // and profiles returned by the POST API
        const existingProfiles = new Map(readyProfiles.map(profile => [profile.url, profile]));
        postData.responses.forEach(profile => existingProfiles.set(profile.url, profile));
        const combinedProfiles = Array.from(existingProfiles.values());

        // Update the ready_profiles in the database
        const { data: updatedData, error } = await supabase
          .from(isExport ? 'csv_campaigns' : 'campaigns')
          .update({ ready_profiles: combinedProfiles })
          .eq('campaign_id', campaignId);

        if (error) {
          console.log('Error updating ready_profiles:', error);
        } else {
          console.log('ready_profiles updated successfully:', updatedData);
          // Update local state
          setReadyProfiles(combinedProfiles);
        }

      } else {
        console.error('Error posting data to POST API');
      }

    } else {
      console.error('Error posting profile to API');
    }
  };


  return (
    <div>
      {notification as JSX.Element}
      <NegativeNotification
        show={showNotification}
        setShow={setShowNotification}
        message={t('profile_finder_negative_notification_msg')}
        messageType={t('profile_finder_negative_notification_msg_type')}
      />
      <div
        className={`p-4 flex justify-between items-center cursor-pointer rounded-t-md h-16 ${isOpen ? 'bg-gray-50' : ''}`}
        onClick={onToggle}
      >
        <div className="flex items-center">
          <div className={`relative h-7 w-7 rounded-full border ${(inputValue !== '') ? 'border-purple-700' : 'border-gray-400'} mr-2 flex-shrink-0`}>
            {(inputValue !== '') && <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-purple-700"></span>}
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
        <div className="">
          <div className="  mb-4 mt-4 mx-4 bg-blue-100 text-blue-700 p-4 rounded-md m-1 flex items-start">

            <InformationCircleIcon className="h-6 w-6 mr-2 flex-shrink-0 text-blue-700" />
            <p className='text-sm'>
              {t('profile_finder_info_msg')}
            </p>
          </div>

          <div className="relative mb-4 mt-4 mx-4 ">
            <input
              className="w-full border border-gray-200 bg-white h-12 pl-5 pr-20 rounded-lg text-sm focus:outline-none"
              type="text"
              value={inputValue}
              onChange={e => {
                setInputValue(e.target.value);
              }}

              placeholder="https://www.linkedin.com/search/results/people"
            />
            <button
              className="h-13 w-20 text-sm absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-md bg-purple-700 text-white"
              onClick={handleSaveSearch}
              // disabled={(!inputValue.startsWith("https://www.linkedin.com/search/results/")) || isLoading}
              disabled={
                (
                  (!inputValue.startsWith("https://www.linkedin.com/search/results/") &&
                    !inputValue.startsWith("https://www.linkedin.com/in/") &&
                    !inputValue.startsWith("https://www.linkedin.com/sales/search/people")) ||
                  isLoading ||
                  (inputValue.startsWith("https://www.linkedin.com/sales/search/people") && !li_a)
                )
              }

            >
              {
                isLoading ?
                  <Spinner message={undefined} size={20} color={'#faf5ff'} />
                  :
                  'Extract'
              }
            </button>


          </div>

        </div>
      </Transition>
    </div>
  );
};

export default ProfileFinderModule;
