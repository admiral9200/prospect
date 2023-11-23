'use client'
import React, { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import LinkedInModule from '@/app/components/campaign/sessionCookieModule';
import PromptModule from '@/app/components/campaign/promptModule';
import ProfileFinderModule from '@/app/components/campaign/profileFinderModule';
import uploadCsvProfileModule from '@/app/components/campaign/uploadCsvProfileModule';
import LinkedInPreviewModule from '@/app/components/campaign/linkedinPreviewModule';
import Link from 'next/link';
import { useSupabaseClient, useSession, useUser } from '@supabase/auth-helpers-react';
import { CheckCircleIcon, InformationCircleIcon, CalendarIcon, ChartPieIcon, DocumentDuplicateIcon, FolderIcon, HomeIcon, UsersIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { PlusIcon } from '@heroicons/react/24/outline';
import Navbar from '@/app/components/ui/navbar';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import useNotification from '@/app/components/ui/notification';
import Spinner from '@/app/components/ui/spinner';
import { CampaignDataContext } from '@/helpers/campaignDataContext';
import { useTranslations } from 'next-intl';
import useLangParam from '@/app/hooks/useLangParam';


const CampaignSetup: React.FC = () => {
  const lang = useLangParam()

  const t = useTranslations('common')
  const modules = [
    {
      id: 1,
      title: "Connect your LinkedIn Account",
      description: "For Prosp to send messages from your account",
      component: LinkedInModule,
      step: 1,
    },
    {
      id: 2,
      title: "AI Prompt",
      description: "Change the style of the AI generated messages",
      component: PromptModule,
      step: 1,
    },
    {
      id: 3,
      title: "LinkedIn Search",
      description: "Extract all profiles URLs from a LinkedIn Search",
      component: ProfileFinderModule,
      step: 2,
    },
    {
      id: 4,
      title: "Upload a CSV",
      description: "Extract all profiles URLs from a .csv or .xls file",
      component: uploadCsvProfileModule,
      step: 2,
    },
    {
      id: 5,
      title: "Preview and run",
      description: "Send messages and connection requests automatically",
      component: LinkedInPreviewModule,
      step: 3,
    },
    // Add more modules here
  ];
  const router = useRouter()
  const supabase = useSupabaseClient()
  const [openModule, setOpenModule] = useState<number | null>(1);
  const [currentPage, setCurrentPage] = useState(1);
  const currentStepModules = modules.filter(module => module.step === currentPage);
  const [foundUrls, setFoundUrls] = useState<string[]>([]);
  const [campaignData, setCampaignData] = useState<any | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isUpdated, setisUpdated] = useState(false);
  const [isRunningBtn, setIsRunningBtn] = useState<any>(true);
  const [isLoading, setIsLoading] = useState(true)

  const user = useUser();
  const [disableNext, setDisableNext] = useState(true);


  useEffect(() => {
    // console.log("useEffect triggered");
    async function checkSubscriptionStatus() {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('subscription_status')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching subscription status:', error);
          return;
        }

        const status = data?.subscription_status;
        if (status !== 'pro' && status !== 'trial' && status !== 'vip') {
          // Redirect to Stripe checkout page
          router.push(`${lang}/subscribe`);
        }
      }
    }

    (async () => await checkSubscriptionStatus())()
  }, [user, supabase, router]);

  const fetchCampaignData = async () => {
    setIsLoading(true)
    let { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('campaign_id', campaignId);

    if (error) {
      console.log('Error fetching campaign data:', error);
      return;
    }

    if (campaigns && campaigns.length > 0) {
      console.log(campaigns[0]);

      console.log("found linkedin_profiles_urls:", campaigns[0].linkedin_profiles_url);

      const linkedin_profiles_url_count = (campaigns[0]?.linkedin_profiles_url?.length ?? 0)
      const processed_urls = campaigns[0]?.processed_urls || []
      const processed_urls_count = (processed_urls.filter(d => d.msg_sent)?.length ?? 0)
      const waiting_connection_count = (campaigns[0]?.waiting_connection?.length ?? 0)

      // console.log(linkedin_profiles_url_count, 'linkedin_profiles_url');
      // console.log(processed_urls_count, 'processed_urls');
      // console.log(waiting_connection_count, 'waiting_connection');

      const count = linkedin_profiles_url_count - processed_urls_count


      if (count < 1) {
        setIsRunningBtn(() => false)
        setDisableNext(() => true)
      }


      setFoundUrls(Array.from(new Set(campaigns[0].linkedin_profiles_url || [])));
      setCampaignData(campaigns[0]);
      setIsRunning(campaigns[0].campaign_running); // Update isRunning

      // Check if data is ready for next step
      if (currentPage === 1) {
        setDisableNext(!campaigns[0].li_at || !campaigns[0].jsessionid || !campaigns[0].prompt);
      } else if (currentPage === 2) {
        setDisableNext(!(campaigns[0].linkedin_profiles_url && campaigns[0].linkedin_profiles_url.length));
      }
    }
    setIsLoading(false)
  };


  const searchParams = useSearchParams()
  const campaignId = searchParams.get('id') || '';
  const stepId = searchParams.get('step') || 1;
  // console.log(typeof campaignId)

  const runCampaign = async () => {
    // Update isRunning state
    setIsRunning(true);
    let { error } = await supabase
      .from('campaigns')
      .update({ campaign_running: true })
      .eq('campaign_id', campaignId);
    console.log('campaign setup run button set campaign_running to true')

    // POST request to trigger campaign
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId: [campaignId] })
    };

    try {
      const response = await fetch('/api/campaigns', requestOptions);
      const data = await response.json();

      console.log('Response:', data);

      if (!response.ok) {
        console.log('Error triggering campaign:', data);
        return;
      }

      setisUpdated(!isUpdated)
      await fetchCampaignData()
      if (error) {
        console.log('Error updating campaign data:', error);
        return;
      }

      console.log('Campaign started successfully');

    } catch (error) {
      console.error('Error:', error);
    }
  };


  const pauseCampaign = async () => {
    console.log('pause');
    // Update the campaign_running to false in the DB here...
    let { error } = await supabase
      .from('campaigns')
      .update({ campaign_running: false })
      .eq('campaign_id', campaignId);

    console.log('campaign setup run button set campaign_running to false')

    if (error) {
      console.log('Error pausing campaign:', error);
      return;
    }

    setIsRunning(false); // Set isRunning to false after successfully pausing the campaign
    await fetchCampaignData()
  };


  const handleButtonClick = () => {
    // console.log(isRunningBtn);
    // const linkedin_profiles_url_count = (campaignData?.linkedin_profiles_url?.length ?? 0)
    // const processed_urls_count = (campaignData?.processed_urls?.length ?? 0)
    // const waiting_connection_count = (campaignData?.waiting_connection?.length ?? 0)

    // console.log(linkedin_profiles_url_count, 'linkedin_profiles_url');
    // console.log(processed_urls_count, 'processed_urls');
    // console.log(waiting_connection_count, 'waiting_connection');


    if (isRunning && currentPage === 3) {
      pauseCampaign();
    } else if (!isRunningBtn && currentPage === 3) {
      return
    } else if (currentPage === 3) {
      console.log('running campaign');
      runCampaign();
    } else {
      nextPage();
    }
  };




  const nextPage = () => {
    if (currentPage < 3) { // Maximum of 3 pages
      setCurrentPage(currentPage + 1);
      // console.log('current page', currentPage + 1);
      router.push(`${lang}/campaign-setup?id=${campaignId}&step=${currentPage + 1}`)
    }
  };

  const previousPage = () => {
    if (currentPage > 1) { // Minimum of 1 page
      setCurrentPage(currentPage - 1);
      router.push(`${lang}/campaign-setup?id=${campaignId}&step=${currentPage - 1}`)
    }
  };



  const getHeaderContent = (step: number) => {
    switch (step) {
      case 1:
        return { title: t('export_campaign_header_title_step_1'), description: t('export_campaign_header_desc_step_1') };
      case 2:
        return { title: t('export_campaign_header_title_step_2'), description: t('export_campaign_header_desc_step_2') };
      case 3:
        return { title: t('export_campaign_header_title_step_3'), description: t('normal_campaign_header_desc_step_3') };
      default:
        return { title: '', description: '' };
    }
  }

  const buttonText = currentPage === 3 ? (isRunning ? t('export_campaign_pause_btn') : t('export_campaign_run_btn')) : t('export_campaign_next_btn');
  const buttonColor = currentPage === 3 ? isRunning ? 'bg-red-700' : isRunningBtn ? 'bg-purple-700' : 'bg-gray-300' : 'bg-purple-700'

  const { title, description } = getHeaderContent(currentPage);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setIsRunningBtn(true);
    (async () => await fetchCampaignData())()
  }, [currentPage, stepId]);

  useEffect(() => {
    setCurrentPage(+stepId);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="bg-white pt-12 pb-12 flex-col items-center lg:justify-center flex-grow overflow-y-auto lg:pl-72">
        <div className="flex flex-col items-center mx-auto lg:max-w-[672px] md:max-w-[672px] p-4 md:p-8">

          <h1 className="text-2xl font-semibold text-center">{title}</h1>
          <p className="mb-8 text-center">{description}</p>
          <div className="w-full mx-auto bg-white rounded-md border border-gray-300 divide-y divide-gray-200">
            <CampaignDataContext.Provider value={{ fetchCampaignData }}>
              {currentStepModules.map((module) => {
                // console.log(module.step);

                const ModuleComponent = module.component;
                return (
                  module.step === +stepId ? <ModuleComponent
                    key={module.id}
                    module={module}
                    isOpen={openModule === module.id}
                    onToggle={() => setOpenModule(openModule === module.id ? null : module.id)}
                    campaignId={campaignId}
                    campaignInfo={[isUpdated, setisUpdated]}
                  /> : null
                );
              })}
            </CampaignDataContext.Provider>

          </div>

          <div className="flex justify-center items-center my-4 space-x-2">
            <div className={`w-3 h-3 rounded-full ${currentPage === 1 ? 'bg-gray-400' : 'bg-gray-200'}`}></div>
            <div className={`w-3 h-3 rounded-full ${currentPage === 2 ? 'bg-gray-400' : 'bg-gray-200'}`}></div>
            <div className={`w-3 h-3 rounded-full ${currentPage === 3 ? 'bg-gray-400' : 'bg-gray-200'}`}></div>
          </div>

          <div className='flex justify-center max-w-md mt-4'>
            <button onClick={currentPage === 1 ? () => router.push(`${lang}/dashboard`) : previousPage} className="bg-gray-200 font-medium w-24 sm:w-48 text-black rounded-md py-3 sm:mr-4">
              <span className="">{t('export_campaign_pre_btn')}</span>
            </button>
            <button
              onClick={handleButtonClick}
              className={`${disableNext ? 'bg-gray-300' : buttonColor} w-24 sm:w-48 text-white font-medium rounded-md py-3 ml-4`}
              disabled={disableNext}
            >
              <span className="mr-1">{buttonText}</span>
            </button>



          </div>

        </div>
      </main>
    </div>
  );



};

export default CampaignSetup;
