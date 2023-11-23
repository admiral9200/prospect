import { useState, useEffect, useContext } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { RoundButton } from '@/app/components/ui/button';
import Spinner from '@/app/components/ui/spinner';
import { useTranslations } from 'next-intl';
import { GlobalContext } from '@/app/context/context';

interface MessageUsageInfo {
  usedMessages: number;
  totalMessages: number;
}

const UsageTrackerAlert: React.FC = () => {
  const { state } = useContext<any>(GlobalContext)
  const t = useTranslations('common')
  const supabase = useSupabaseClient();
  const user = useUser();
  // console.log('user id from usagetracker:', user?.id);
  const [isFetched, setIsFetched] = useState(false)
  const [used, setUsed] = useState(0);
  const [total, setTotal] = useState(1); // assuming 3 as the default total chatbots limit
  const [loading, setLoading] = useState(true);
  const [messageUsageInfo, setMessageUsageInfo] = useState<MessageUsageInfo>({
    usedMessages: 0,
    totalMessages: 30,
  });

  //Fetch the number of chatbots and messages that have been used and that are available for the user
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!user) throw new Error('No user');
        if (!state?.workspace_id) throw new Error("workspace_id is required");
        if (!state?.workspace_id) throw new Error("workspace_id is required");
        // console.log('this is user.id', user.id)

        const {
          data: chatbotsData,
          error: chatbotsError,
          status,
        } = await supabase
          .from('campaigns')
          .select(`campaign_id`)
          .eq('workspace_id', state.workspace_id);
          // .eq('user_id', user.id);

        const {
          data: csvChatbotsData,
          error: csvChatbotsError,
          status: csvStatus,
        } = await supabase
          .from('csv_campaigns')
          .select(`campaign_id`)
          .eq('workspace_id', state.workspace_id);
        // .eq('user_id', user.id);
        // console.log('this is chatbotsData', chatbotsData)

        if ((chatbotsError && !chatbotsData) || (csvChatbotsError && !csvChatbotsData)) {
          throw chatbotsError;
        }
        // console.log('this is user.id', user.id)
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('counter, price_id, subscription_status')
          .eq('id', user!.id)
          .single();

        if (profileError) {
          console.log('Error fetching profile info:', profileError.message);
        } else if (profileData) {
          let totalMessages = 30; // default total
          let totalChatbots = 4; // default total chatbots

          if (profileData.subscription_status === 'active') {
            if (
              profileData.price_id === 'price_1NDN0WIkovXCkJrGqz3e4PyB' ||
              profileData.price_id === 'price_1NDN02IkovXCkJrGrSyMzHFD'
            ) {
              totalMessages = 10000;
              totalChatbots = 10; // Update this based on your plan
            } else if (
              profileData.price_id === 'price_1NDMwlIkovXCkJrGR7mC6lhG' ||
              profileData.price_id === 'price_1NDMv2IkovXCkJrGRlQfZUXr'
            ) {
              totalMessages = 1000;
              totalChatbots = 4; // Update this based on your plan
            }
          }

          setTotal(totalChatbots);
          setMessageUsageInfo({
            usedMessages: profileData.counter as number,
            totalMessages,
          });
        }
        const totalCampaings = chatbotsData?.length + csvChatbotsData?.length
        console.log(totalCampaings);


        setUsed(totalCampaings || 0);
      } catch (error) {
        // console.log(error);
      } finally {
        setLoading(false);
        setIsFetched(true)
      }
    };
    if (!user) return
    if (isFetched) return
    fetchData();
  }, [user, state.workspace_id]);

  // useEffect(() => {
  //   console.log(used);
  // }, [used]);

  const { usedMessages, totalMessages } = messageUsageInfo;
  const percentageMessages = (usedMessages / totalMessages) * 100;
  const percentageChatbots = (used / total) * 100;

  if (loading) {
    return <section className="flex flex-col self-center rounded-lg border border-gray-200 bg-white p-4 mb-8">
      <Spinner color={undefined} size={undefined} message={t('usage_tracker_spinner_fetch_msg')} />
    </section>
  }
  return (
    <section className="flex flex-col self-center rounded-lg border border-gray-200 bg-white p-4 mb-8">
      {/* Tracker for number of chatbots */}
      <div className="mb-1 flex justify-between">
        <h3 className="text-sm font-semibold">{t('usage_tracker_campaign_title')}</h3>
        <span className="text-primary-action text-sm font-semibold">
          {used}/{total}
        </span>
      </div>
      <p className="mb-3 text-xs text-gray-900">
        {t('usage_tracker_campaign_subtitle')}
      </p>
      <div
        className="relative mb-4 h-2 w-full rounded-lg"
        style={{ backgroundColor: 'rgb(241, 243, 254)' }}
      >
        <div
          className="absolute left-0 top-0 h-2 rounded-lg bg-blue-200 transition-[width] ease-in-out"
          style={{
            width: `${percentageChatbots}%`,
          }}
        ></div>
      </div>   {/* Tracker for number of messages 
          <hr className='mt-4 mb-6'/>
   
      <div className="mb-1 flex justify-between">
        <h3 className="text-sm font-semibold">Available requests</h3>
        <span className="text-primary-action text-sm font-semibold">
          {usedMessages}/{totalMessages}
        </span>
      </div>
      <p className="mb-3 text-xs text-gray-900">
        Number of messages you can send via a campaign
      </p>
      <div
        className="relative mb-4 h-2 w-full rounded-lg"
        style={{ backgroundColor: 'rgb(241, 243, 254)' }}
      >
        <div
          className="absolute left-0 top-0 h-2 rounded-lg bg-[#52B5F9] transition-[width] ease-in-out"
          style={{
            width: `${percentageMessages}%`,
          }}
        ></div>
      </div>*/}
      {/* <div className="block w-full" >
      <Link className="self-center" href="/pricing">
        
      <RoundButton title="Upgrade" isActive={true} />
      </Link></div> */}
    </section>
  );
};

export default UsageTrackerAlert;
