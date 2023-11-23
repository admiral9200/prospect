'use client'

import { useState, useEffect, useCallback, useContext } from 'react';
import { EnvelopeOpenIcon, HeartIcon, UserGroupIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import useNotification from '@/app/components/ui/notification';
import Spinner from '@/app/components/ui/spinner';
import { useTranslations } from 'next-intl';
import { GlobalContext } from '@/app/context/context';


function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}


export default function Analytics() {
  const t = useTranslations('common')
  const { state, dispacth } = useContext<any>(GlobalContext)
  const selcted_workspace = state?.selected_workspace[0] || []

  const supabase = useSupabaseClient();
  const router = useRouter();
  const user = useUser();
  const [notification, notify] = useNotification();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [isFetched, setIsFetched] = useState(false)

  interface Campaign {
    campaign_id: string;
    campaign_name: string;
    analytics: any;
    campaign_running: boolean;
    linkedin_profiles_url: string[];
    num_of_prospects: number; // Add this line
    num_of_sent_connection: number; // Add this line
    num_of_msgs_sent: number; // Add this line
    num_of_msgs_seen: number; // Add this line
    num_of_msgs_replied: number; // Add this line
  }

  const toggleTable = () => {
    setShowTable(prevState => !prevState);
  }

  const fetchStats = async () => {
    try {
      let { data: campaignIds, error: campaignError, status: campaignStatus } = await supabase
        .from('campaigns')
        .select(`campaign_id`)
        // .eq('user_id', user?.id);
        .eq('workspace_id', selcted_workspace?.id);

      // console.log([campaign.campaign_id])
      const campain_ids = (campaignIds || []).map(c => c.campaign_id)
      if (campain_ids.length > 0) {

        const response = await fetch("/api/analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ campaignIds: campain_ids }),
        });

        console.log('called api/analytics via campaign')

        if (!response.ok) {
          console.error("Error calling new API:", response.statusText);
        }
        const json = await response.json()
      }
      // await getProfile()

      // console.log(json);

    } catch (error: any) {
      console.error("Error calling new API:", error.message);
    }
  }


  const getProfile = async () => {
    try {
      if (!user || !selcted_workspace?.id ) {
        console.log('no user or workspace id');
        return; // Early return if no user
      }
      await fetchStats()
      // Fetch campaigns related to the user
      let { data: campaignData, error: campaignError, status: campaignStatus } = await supabase
        .from('campaigns')
        .select(`campaign_name, campaign_id, analytics, campaign_running, linkedin_profiles_url, waiting_connection, processed_urls`)
        // .eq('user_id', user?.id);
        .eq('workspace_id', selcted_workspace?.id);


      if (campaignError && campaignStatus !== 406) {
        (notify as (type: string, message: string, description: string) => void)(
          'error',
          'Problem fetching your campaigns',
          'Please refresh the page',
        );
      }

      console.log('thats campaignData', campaignData);

      // const filteredConnectionWaiting = campaignData?.map(c => )

      // setCampaigns(
      //   (campaignData || []).map((campaign) => ({ ...campaign, num_of_prospects: campaign.linkedin_profiles_url.length, num_of_sent_connection: campaign?.waiting_connection.filter(p => p.req_sent).length }))
      // );
      setCampaigns(
        (campaignData || []).map((campaign) => {
          console.log((campaign?.processed_urls || []), 'processed_urls');
          // console.log((campaign?.waiting_connection || []).length, 'waiting connection');


          return {
            ...campaign,
            num_of_prospects: (campaign.linkedin_profiles_url || []).length,
            num_of_sent_connection: (campaign?.waiting_connection || []).length,
            num_of_msgs_sent: (campaign?.processed_urls || []).length,
            num_of_msgs_seen: (campaign?.processed_urls.filter(p => p.msg_replied ? p.msg_replied : p.msg_seen) || []).length,
            num_of_msgs_replied: (campaign?.processed_urls.filter(p => p.msg_replied) || []).length
          }
        })
      );

      // Fetch user profile information
      let { data: userData, error: userError } = await supabase
        .from('users')
        .select(`id, user_name, user_linkedinprofile`)
        .eq('id', user?.id);

      if (userError) {
        (notify as (type: string, message: string, description: string) => void)(
          'error',
          t('analytics_user_err_msg'),
          t('analytics_user_err_desc'),
        );
        console.log(userError);
      }

      // You can set this userData to a state or handle it as needed
      // ...
    } catch (campaignError) {
      console.log(campaignError);
      console.log('No analytics available.');
    }
    setIsFetched(true);
  }



  useEffect(() => {
    if (isFetched) return
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {

        if (session && session.user) {
          (async () => {
            setLoading(true);
            try {
              await getProfile()
            } catch (error) {
              console.log(error);
            } finally {
              setLoading(false);
            }
          })()
        } else {
          router.push('/login');
        }
      }
    );

    // Cleanup function: removes the listener when the component is unmounted
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth, router, user, isFetched, state.workspace.id]); // Add `user` here

  useEffect(() => {
    setIsFetched(false)
  }, [selcted_workspace])


  const statusBadge = (status) => {
    if (status) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
    } else {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Inactive</span>
    }
  }


  // console.log('campaigns:', campaigns);
  // console.log(campaigns.reduce((acc, curr) => acc + (curr.analytics?.num_of_sent_connection || 0), 0).toLocaleString(),);
  // console.log(campaigns.reduce((acc, curr) => acc + (curr?.num_of_sent_connection || 0), 0));

  const totalStats = [
    {
      id: 1,
      name: t('analytics_total_stats_id_1'),
      stat: campaigns.reduce((acc, curr) => acc + (curr.num_of_msgs_sent || 0), 0).toLocaleString(),
      icon: UserGroupIcon,
    },
    {
      id: 2,
      name: t('analytics_total_stats_id_2'),
      stat: campaigns.reduce((acc, curr) => acc + (curr.num_of_msgs_seen || 0), 0).toLocaleString(),
      icon: EnvelopeOpenIcon,
    },
    {
      id: 3,
      name: t('analytics_total_stats_id_3'),
      stat: campaigns.reduce((acc, curr) => acc + (curr.num_of_msgs_replied || 0), 0).toLocaleString(),
      icon: HeartIcon,
    },
    {
      id: 4,
      name: t('analytics_total_stats_id_4'),
      stat: campaigns.reduce((acc, curr) => acc + (curr?.num_of_sent_connection || 0), 0).toLocaleString(),
      icon: UserPlusIcon,
    },
  ];


  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    loading ? <Spinner color={undefined} size={undefined} message={t('analytics_spinner_loading_msg')} />
      :
      <div>
        {notification as JSX.Element}

        <div className="px-4 sm:px-6 lg:px-8">
          <div className=' '>
            {/* Here we display the total stats in a similar design structure */}
            {!loading &&
              <div>
                <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {totalStats.map((item) => (
                    <div key={item.id} className="relative overflow-hidden rounded-lg bg-white px-4 pt-5  border shadow ">
                      <dt>
                        <div className="absolute rounded-md bg-indigo-500 p-3">
                          <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </div>
                        <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                      </dt>
                      <dd className="ml-16 pb-6 sm:pb-7 relative ">
                        <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                        <button onClick={toggleTable} className="absolute right-0 bottom-2 text-xs text-blue-500 rounded">{showTable ? t('analytics_hide_table') : t('analytics_see_more_table')}</button>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            }
            {showTable &&
              <section id="campaigns" className='flex flex-wrap gap-x-6 w-full items-center justify-center'>
                {loading && <Spinner color={undefined} size={undefined} message={t('analytics_spinner_campaign_msg')} />}
                {!loading &&
                  <div className="overflow-x-auto mt-8 w-full">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('analytics_campaign_name')}</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('analytics_prospects')}</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('analytics_messages_sent')}</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('analytics_messages_seen')}</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('analytics_replies')}</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('analytics_sent_connection')}</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('analytics_status')}</th>

                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {campaigns.map(campaign => {
                          const analytics = campaign.analytics || null;
                          return (
                            <tr key={campaign.campaign_id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.campaign_name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.num_of_prospects}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{analytics?.num_of_sent}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{analytics?.num_of_seen}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{analytics?.num_of_replies}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign?.num_of_sent_connection}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{statusBadge(campaign.campaign_running)}</td>
                            </tr>
                          )
                        })}

                      </tbody>
                    </table>
                  </div>
                }
              </section>
            }  </div>
        </div>


      </div>
  );

}
