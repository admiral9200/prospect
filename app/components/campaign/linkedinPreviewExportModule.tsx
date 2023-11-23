import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

import React, { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Highlighter from "react-highlight-words";
import { InformationCircleIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import DeleteBtn from '@/app/components/ui/deleteBtn';
import { ExportToCsv } from 'export-to-csv';
import useNotification from '@/app/components/ui/notification';
import { useTranslations } from 'next-intl';
import DeleteAll from '@/app/components/ui/DeleteAll';
import CheckBox from '@/app/components/ui/CheckBox';
import useExport from '@/app/hooks/useExport';

const options = {
  fieldSeparator: ',',
  quoteStrings: '"',
  decimalSeparator: '.',
  showLabels: true,
  showTitle: false,
  title: 'data',
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true,
};

const csvExporter = new ExportToCsv(options);

function normalizeUrl(url) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

const LinkedInPreviewModule: React.FC<{ campaignId: string, campaignInfo: any }> = ({ campaignId, campaignInfo }) => {
  const t = useTranslations('common')
  const [isUpdated, setisUpdated] = campaignInfo
  const supabase = useSupabaseClient();
  const [selectedDiv, setSelectedDiv] = useState<number | null>(null);
  const [identifiedUrls, setIdentifiedUrls] = useState<number>(0);
  const [totalCountUrls, setTotalCountUrls] = useState<number | null>(0);
  const [processedUrls, setProcessedUrls] = useState<any[]>([]);
  const [waitingConnectionUrls, setWaitingConnectionUrls] = useState<any[]>([]);
  const [errWaitingConnectionUrls, setErrWaitingConnectionUrls] = useState<any[]>([]);
  const [scrappedProfiles, setScrappedProfiles] = useState<any[]>([]);
  const [editingProfileUrl, setEditingProfileUrl] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [foundUrls, setFoundUrls] = useState<string[]>([]);
  const [readyProfiles, setReadyProfiles] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [liAt, setLiAt] = useState('');
  const [ajax, setAjax] = useState('');
  const [loadingProfiles, setLoadingProfiles] = useState<{ [url: string]: boolean }>({});
  const [isLoadingSubBody, setIsLoadingSubBody] = useState(true)
  const [multiSelect, setMultiSelect] = useState<string[]>([])
  const isExport = useExport()

  const [notification, notify] = useNotification();



  const [inputValue, setInputValue] = useState('');
  type ApiResponse = {
    responses: Array<{
      url: string;
      id: string;
      response: string;
    }>;
  };

  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);



  const generateFile = async () => {
    const data = readyProfiles.map((p) => {
      let experience = '';
      (p.exp || []).forEach(e => {
        experience += `Title : ${e.title}
        Subtitle : ${e.subtitle}
        Skill : ${e.skill}
        CompanyUrl : ${e.url}
        `
      });
      let user_post = '';
      (p.post[0].user_post || []).forEach((p, i) => {
        user_post += `${i + 1} - ${p}\n`
      });
      let user_repost = '';
      (p.post[0].reposted_post || []).forEach((p, i) => {
        user_repost += `${i + 1} - ${p}\n`
      });
      return {
        "ProfileUrl": p.url,
        "AccountName": p.firstName + " " + p.lastName,
        "Message": p.response,
        "firstName": p.firstName,
        "lastName": p.lastName,
        "Headline": p.headline,
        "Biography": p.bio,
        "Email": p.email,
        "CompanyName": p.companyName,
        "Experience": experience,
        "User's Post": user_post,
        "Repost": user_repost
      }
    })
    if (data.length < 1) {
      // Show notification to user
      (notify as (type: string, message: string, description: string) => void)(
        'error',
        'Cannot export to csv',
        `There is 0 profile in ready profiles.`,
      );
      return;
    }
    csvExporter.generateCsv(data);
  };


  const updateProfileInDb = async (updatedProfile) => {
    // Clone the existing profiles
    const updatedReadyProfiles = [...readyProfiles];

    // Find the profile that needs to be updated
    const profileToUpdate = updatedReadyProfiles.find(profile => profile.url === updatedProfile.url);

    if (!profileToUpdate) {
      console.error('Profile not found:', updatedProfile.url);
      return;
    }

    // Update the message of the profile
    profileToUpdate.response = updatedProfile.response;

    // Perform the update operation on the database
    const { data, error } = await supabase
      .from(isExport ? 'csv_campaigns' : 'campaigns')
      .update({
        ready_profiles: updatedReadyProfiles,
      })
      .eq('campaign_id', campaignId);

    // Error handling
    if (error) {
      console.error('Error updating profile:', error);
      return;
    }

    // If successful, update the readyProfiles state
    setReadyProfiles(updatedReadyProfiles);
  };


  useEffect(() => {
    let countdownTimeout;

    if (countdown > 0) {
      countdownTimeout = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (loading) {
      setLoading(false);
    }

    return () => {
      clearTimeout(countdownTimeout);
    };
  }, [countdown, loading]);

  const saveResponseToDb = (url) => {
    const updatedProfile = readyProfiles.find(profile => profile.url === url);
    updateProfileInDb(updatedProfile);

    // Clear the currently editing profile URL when saved
    setEditingProfileUrl(null);
  };


  const fetchCampaignData = async () => {
    setIsLoadingSubBody(true)
    let { data: campaigns, error } = await supabase
      .from(isExport ? 'csv_campaigns' : 'campaigns')
      .select('*')
      .eq('campaign_id', campaignId);

    if (error) {
      console.log('Error fetching campaign data:', error);
      return;
    }

    if (campaigns && campaigns.length > 0) {
      setFoundUrls(campaigns[0].linkedin_profiles_url);

      setTotalCountUrls(campaigns[0].total_search_results);
      setReadyProfiles(campaigns[0].ready_profiles || []);
      setScrappedProfiles(campaigns[0].scrapped_profiles || [])

      setProcessedUrls(campaigns[0].processed_urls || []);

      setIdentifiedUrls(campaigns[0].total_search_results);

      setInputValue(campaigns[0].linkedin_search_url ? campaigns[0].linkedin_search_url : '');
      setLiAt(campaigns[0].li_at);
      setAjax(campaigns[0].jsessionid);
      setInputValue(campaigns[0].linkedin_search_url ? campaigns[0].linkedin_search_url : '');
    }
    setIsLoadingSubBody(false)

  };

  // Calculate the status counts
  const statusCounts = {
    Sent: processedUrls.length,
    Queue: foundUrls.length - processedUrls.length
  };



  const Status = ({ status, count, err, showCount = true }: { status: string, count: number, err?: any, showCount?: boolean }) => {
    const selected = status === selectedStatus;

    let bgColor = 'bg-violet-100'; // Default background color
    if (status === 'Ready') bgColor = 'bg-green-100';
    else if (status === 'Queue') bgColor = 'bg-orange-100';

    return (
      <div onClick={() => setSelectedStatus(status)}
        className={`shrink-0 px-3 pr-3 py-1 ${bgColor} flex items-center space-x-2 rounded-2xl cursor-pointer`}
      >
        {status === 'Ready' ? <CheckCircleIcon className={`h-5 w-5 ${selected ? 'text-green-600' : 'text-green-500'}`} /> : null}
        {status === 'Queue' && <ClockIcon className={`h-5 w-5 ${selected ? 'text-orange-500' : 'text-orange-400'}`} />}
        <p>{
          status === 'All' ? t('linkedin_pre_module_all') :
            status === 'Sent' ? t('linkedin_pre_module_sent') :
              status === 'Ready' ? t('linkedin_pre_module_ready') :
                status === 'Queue' ? t('linkedin_pre_module_queue') :
                  status === 'Connection' ? t('linkedin_pre_module_connection') :
                    null
        } {showCount && `(${count})`}</p>
      </div>
    );
  };


  const handleResponseChange = (url, newValue) => {
    setReadyProfiles(prevProfiles =>
      prevProfiles.map(profile =>
        profile.url === url ? { ...profile, response: newValue } : profile
      )
    );

    // Set the currently editing profile URL when a response is changed
    setEditingProfileUrl(url);
  };


  const postProfileToApi = async (profiles) => {
    const loadingState = profiles.reduce((state, profileUrl) => {
      state[profileUrl] = true;
      return state;
    }, {});
    setLoadingProfiles(loadingState);

    const { data: campaignData, error: fetchError } = await supabase
      .from(isExport ? 'csv_campaigns' : 'campaigns')
      .select('scrapped_profiles')
      .eq('campaign_id', campaignId);

    if (fetchError) {
      console.error('Error fetching existing data:', fetchError);
      return;
    }

    const existingScrappedProfiles = campaignData[0]?.scrapped_profiles || [];

    setLoading(true);
    setCountdown(15);

    if (user === null) {
      console.error('User is not logged in');
      return;
    }

    console.log("this is the profiles", profiles)
    const bodyData = {
      profiles_urls: profiles.map(normalizeUrl),
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
      console.log(data.data);

      // Map of existing profiles, using url as key
      const existingProfilesMap = new Map(existingScrappedProfiles.map(profile => [profile.url, profile]));

      // Replace or add new profiles
      data.data.forEach(profile => existingProfilesMap.set(profile.url, profile));

      const combinedScrappedProfiles = Array.from(existingProfilesMap.values());

      const { error: storeError } = await supabase
        .from(isExport ? 'csv_campaigns' : 'campaigns')
        .update({
          scrapped_profiles: combinedScrappedProfiles  // updated here
        })
        .eq('campaign_id', campaignId);
      const loadingState = profiles.reduce((state, profileUrl) => {
        state[profileUrl] = true;
        return state;
      }, {});
      setLoadingProfiles(loadingState);


      if (storeError) {
        console.error('Error storing scrapped profiles:', storeError);
      }

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
        setApiResponse(postData);
        // On successful response, stop loading and countdown

        setLoading(false);
        setCountdown(0);
        setLoadingProfiles(prevState => {
          const nextState = { ...prevState };
          profiles.forEach(profileUrl => {
            nextState[profileUrl] = false;
          });
          return nextState;
        });

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
          // Refresh the campaign data
          fetchCampaignData();
        }

      } else {
        console.error('Error posting data to POST API');
        setLoadingProfiles(prevState => {
          const nextState = { ...prevState };
          profiles.forEach(profileUrl => {
            nextState[profileUrl] = false;
          });
          return nextState;
        });

      }

    } else {
      console.error('Error posting profile to API');
    }
  };

  const filteredUrls = foundUrls
    .filter(url => {
      if (selectedStatus === 'All') return true;
      if (selectedStatus === 'Ready' && readyProfiles.find(profile => profile.url === url)) return true;
      if (selectedStatus === 'Queue' && !readyProfiles.find(profile => profile.url === url)) return true;
      return false;
    });

  const deleteUrl = async (url) => {
    // console.log(url);
    try {
      let { data: campaigns, error } = await supabase
        .from(isExport ? 'csv_campaigns' : 'campaigns')
        .select('*')
        .eq('campaign_id', campaignId);

      if (error) {
        console.log('Error fetching campaign data:', error);
        return;
      }

      let filteredNormalizedUrls = []

      if (campaigns && campaigns.length > 0) {
        // console.log(campaigns[0].linkedin_profiles_url);
        filteredNormalizedUrls = campaigns[0].linkedin_profiles_url.filter(u => u != url)
        // console.log(filteredNormalizedUrls);
      }

      const { error: storeError } = await supabase
        .from(isExport ? 'csv_campaigns' : 'campaigns')
        .update({
          linkedin_profiles_url: filteredNormalizedUrls  // updated here
        })
        .eq('campaign_id', campaignId);

      if (storeError) {
        console.log('Error fetching campaign data:', error);
        return;
      }

      setisUpdated(!isUpdated)

    } catch (error) {
      console.log(error);
    }

  }


  useEffect(() => {
    (async () => await fetchCampaignData())()
  }, [isUpdated]);

  const handleMultiSelect = (url) => {
    const urls = multiSelect.includes(url) ? multiSelect.filter(u => u != url) : [...multiSelect, url]
    setMultiSelect(urls)
  }


  return (
    <div className='pb-[0.4px] h-[527px]'>
      {notification as JSX.Element}
      <div className=' pt-4 '>
        <div className='px-4'>
          <div className="bg-blue-100 text-blue-700 p-4 rounded-md mb-4 flex items-start">
            <InformationCircleIcon className="h-6 w-6 mr-2 flex-shrink-0 text-blue-700" />
            <p className='text-sm'>
              {t('linkedin_pre_module_identified')} <span className='font-semibold'>{identifiedUrls} {t('linkedin_pre_module_linkedin_profile')}</span>.{t('linkedin_pre_export_module_rest_of_msg')}
            </p>

          </div>
          <div className='flex items-center mb-4'>
            <button
              className='bg-gray-100 rounded-lg h-8 w-11'
              onClick={generateFile} >
              <ArrowDownTrayIcon className={`inline-flex items-center h-6`} />
            </button>
            <span className="ml-3 inline-flex text-sm font-medium text-gray-700">
              {t('linkedin_pre_module_export_to_csv')}
            </span>
          </div>


          <input
            className="border border-gray-300 px-2 py-2 text-sm w-full rounded-md mb-2"
            type="text"
            placeholder="Search profiles..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {multiSelect.length > 0 ? <DeleteAll
            campaignId={campaignId}
            handleMultiSelect={setMultiSelect}
            handleUpdate={setisUpdated}
            isExport={isExport}
            campaign={{ foundUrls, processedUrls, multiSelect, readyProfiles }} /> :
            <div className="flex mt-2 space-x-3 mb-4 overflow-auto">
              <Status status='All' count={foundUrls.length} />
              <Status status='Ready' count={readyProfiles.length} />
              <Status status='Queue' count={identifiedUrls - readyProfiles.length} />
            </div>
          }

        </div>

        <style>
          {`
          div::-webkit-scrollbar {
            width: 8px;
          }
          div::-webkit-scrollbar-thumb {
            background: transparent;
          }
          div:hover::-webkit-scrollbar-thumb {
            background: #888;
          }
          `}
        </style>

        <div className='max-h-48 sm:max-h-60 lg:max-h-64 ' style={{
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "transparent transparent",
        }}>
          {
            filteredUrls
              .filter(url => url.includes(searchValue))
              .map((url, index) => {
                const isProcessed = (readyProfiles.find(profile => profile.url === url));
                const isWaiting = (waitingConnectionUrls.find(waitingUrl => waitingUrl.url === url) || errWaitingConnectionUrls.find(profile => profile.url === url));
                const isChecked = multiSelect.find(u => u === url)
                let status;

                if (isProcessed) status = 'Ready';
                else status = 'Queue';

                const processedUrl = readyProfiles.find(profile => profile.url === url);

                // Check if the profile is in the readyProfiles array
                const readyProfile = readyProfiles.find(profile => profile.url === url);
                const processedProfile = (readyProfiles.find(profile => profile.url === url));
                const waitingProfile = waitingConnectionUrls.find(profile => profile.url === url);
                const scrappedProfile = scrappedProfiles.find(profile => profile.url === url);


                const imageUrl = scrappedProfile?.imageUrl || readyProfile?.imageUrl || processedProfile?.imageUrl || waitingProfile?.imageUrl || "/no-profile-picture.svg";

                return (
                  <div key={index} className={`flex flex-col border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <div
                      className={` flex justify-between cursor-pointer items-center ml-2 rounded-t-md h-16 p-3 ${selectedDiv === index ? 'bg-gray-50' : ''}`}
                    // onClick={() => setSelectedDiv(selectedDiv === index ? null : index)}
                    >
                      <CheckBox
                        status={status}
                        isChecked={isChecked}
                        imageUrl={imageUrl}
                        handleMultiSelect={() => handleMultiSelect(url)} />
                      <div className="flex-grow text-left ml-4"
                        onClick={() => setSelectedDiv(selectedDiv === index ? null : index)}
                      >
                        <div className="text-sm">
                          <div
                            className="whitespace-nowrap overflow-hidden overflow-ellipsis 
   max-w-[100px] sm:max-w-[300px] md:max-w-[300px] lg:max-w-[330szpx] xl:max-w-[320px]"
                            title={decodeURIComponent(url)}
                          >

                            <Highlighter
                              highlightClassName="bg-yellow-300"
                              searchWords={[searchValue]}
                              autoEscape={true}
                              textToHighlight={decodeURIComponent(url)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex items-center space-x-2">
                        <div><Status status={status} count={1} showCount={false} err={url} /></div>
                        {(status === 'Queue' && multiSelect.length < 1) && <DeleteBtn url={url} deleteUrl={deleteUrl} />}
                      </div>
                    </div>
                    {selectedDiv === index &&
                      <div className='pl-2'>
                        <div className="pb-3 px-2 bg-gray-100 rounded-b-md">
                          <div className='p-3 bg-white rounded-md border border-gray-200 text-sm'>
                            {
                              readyProfiles.find(profile => profile.url === url) ? (
                                <>
                                  <textarea
                                    value={readyProfiles.find(profile => profile.url === url).response}
                                    onChange={(event) => handleResponseChange(url, event.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded h-24"
                                    disabled={
                                      waitingConnectionUrls.find(waitingUrl => waitingUrl.url === url) || // Disable textarea for waiting profiles
                                      readyProfiles.find(processedUrl => processedUrl.url === url) // Disable textarea for procesedUrl
                                    }
                                  />
                                  <div className="flex mt-3">
                                    {!processedUrl || processedUrl.url !== url ? (
                                      <button
                                        onClick={() => postProfileToApi([url])}
                                        className={`rounded-md w-1/2 bg-violet-600 hover:bg-violet-700 p-3 text-white mr-2 ${loadingProfiles[url] ? 'opacity-50 pointer-events-none' : ''
                                          }`}
                                        disabled={loadingProfiles[url]}
                                      >
                                        {loadingProfiles[url] ? 'Generating...' : 'Generate again'}
                                      </button>
                                    ) : null}
                                    {
                                      readyProfiles.find(profile => profile.url === url) &&
                                      editingProfileUrl === url &&
                                      !waitingConnectionUrls.find(waitingUrl => waitingUrl.url === url) &&
                                      (!processedUrl || processedUrl.url !== url) && (
                                        <button
                                          onClick={() => saveResponseToDb(url)}
                                          className={`rounded-md w-1/2 p-3 ml-2 ${editingProfileUrl === url ? 'bg-green-500 hover:bg-green-700 text-white' : 'bg-gray-100 text-gray-300'
                                            }`}
                                        >
                                          {t('linkedin_pre_module_save_and_update')}
                                        </button>
                                      )
                                    }
                                  </div>
                                </>
                              ) : (
                                waitingConnectionUrls.find(waitingUrl => waitingUrl.url === url) ? (
                                  // Display the response of waitingUrl here
                                  <div>
                                    <span className='text-sm italic'> {t('linkedin_pre_module_send_msg_when_connection_accepted')}  <br /><br /> </span>{waitingConnectionUrls.find(waitingUrl => waitingUrl.url === url).response}
                                  </div>
                                ) : processedUrl ? processedUrl.response : (
                                  loading ? (
                                    <div>
                                      <ClockIcon className="h-4 w-4 text-orange-400 inline" />
                                      <span className="ml-2">{t('linkedin_pre_module_generating_msg')} {countdown}</span>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => postProfileToApi([url])}
                                      className="rounded-md w-full bg-violet-600 p-3 text-white"
                                    >
                                      {t('linkedin_pre_module_extract_and_preview')}
                                    </button>
                                  )
                                )
                              )
                            }
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                );
              })
          }

        </div>

      </div>
    </div>
  );

};

export default LinkedInPreviewModule;
