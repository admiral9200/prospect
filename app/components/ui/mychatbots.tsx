import { Fragment, useState, useEffect, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bars3Icon, HomeIcon, XMarkIcon, InboxIcon, ChartBarIcon, EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/outline';
import NegativeNotification from '@/app/components/ui/negativeNotification';
import ConfirmDel from '@/app/components/ui/ConfirmDel';
import Navbar from '@/app/components/ui/navbar';
import {
  useUser,
  useSupabaseClient,
  Session,
} from '@supabase/auth-helpers-react';

interface ChatbotsProps {
  session: Session | null;
}

export default function MyChatbots({ session }: ChatbotsProps) {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();

  const [isUsageLimitReached, setIsUsageLimitReached] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const fetchUsageData = async () => {
    let totalChatbotsAllowed = 4;

    console.log('this is the user.id we getting', user!.id)
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user!.id)
      .single();

    if (profileError || !profileData) {
      console.error('Error fetching user profile in fetchUsage MyChatbots:', profileError);
      return;
    }

    if (profileData.subscription_status === 'active') {
      if (profileData.price_id === 'price_1NDN0WIkovXCkJrGqz3e4PyB' || profileData.price_id === 'price_1NDN02IkovXCkJrGrSyMzHFD') {
        totalChatbotsAllowed = 10;
      } else if (profileData.price_id === 'price_1NDMwlIkovXCkJrGR7mC6lhG' || profileData.price_id === 'price_1NDMv2IkovXCkJrGRlQfZUXr') {
        totalChatbotsAllowed = 4;
      }
    }

    const { data: campaignsData, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user!.id);

    const { data: csvCampaignsData, error: csvCampaignsError } = await supabase
      .from('csv_campaigns')
      .select('*')
      .eq('user_id', user!.id);

    if (campaignsError || !campaignsData || csvCampaignsError || !csvCampaignsData) {
      console.error('Error fetching campaigns:', campaignsError);
      return;
    }

    const totalCampaings = campaignsData.length + csvCampaignsData.length

    if (totalCampaings >= totalChatbotsAllowed) {
      setIsUsageLimitReached(true);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsageData();
    }
  }, [user]);




  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<number | string | null>(null);

  const deleteCampaign = async (id: number | string) => {
    console.log(`Attempting to delete campaign with id: ${id}`);

    try {
      const { error: deleteCampaignError } = await supabase
        .from('campaigns')
        .delete()
        .eq('campaign_id', id);

      if (deleteCampaignError) {
        console.error('Error response from Supabase when attempting to delete:', deleteCampaignError);
        throw deleteCampaignError;
      }

      setChatbots(campaigns.filter((campaign) => {
        const isSameId = campaign.campaign_id === id;
        if (isSameId) console.log(`Deleting campaign with id: ${campaign.campaign_id}`);
        return !isSameId;
      }));
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const [loading, setLoading] = useState(true);
  const [campaigns, setChatbots] = useState<
    Array<{
      campaign_id: number | string;
      chatbot_name: string | null;
      chatbot_description: string | null;
      dropdownOpen: boolean;
    }>
  >([]);


  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      if (!user) throw new Error('No user');
      console.log('this is the user is mycampaigns getprofile', user.id)
      let { data, error, status } = await supabase
        .from('campaigns')
        .select(`chatbot_name, chatbot_description, campaign_id`)
        .eq('user_id', user.id);

      if (error && status !== 406) {
        throw error;
      }

      setChatbots(
        (data || []).map((campaign) => ({ ...campaign, campaign_id: campaign.campaign_id, dropdownOpen: false }))
      );



    } catch (error) {
      alert('Error loading user data!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const toggleDropdown = (campaign_id: number | string) => {
    setChatbots(
      campaigns.map((campaign) =>
        campaign.campaign_id === campaign_id
          ? { ...campaign, dropdownOpen: !campaign.dropdownOpen }
          : campaign
      )
    );
  };


  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <NegativeNotification
        show={showNotification}
        setShow={setShowNotification}
        message="You've reached the maximum number of campaigns. Please upgrade for more."
        messageType='Error creating a new campaign' />
      <div>

        <div className="flex min-h-screen flex-col lg:flex-row">
          {/* Navbar for mobile */}
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 flex-grow bg-white py-10 xl:px-28 md:ml-12 lg:ml-72">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center">
                {/* List of campaigns */}
                <section className="campaigns w-full">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-medium">My Chatbots</h1>
                    <div className="hidden lg:flex">
                      <button
                        type="button"
                        onClick={() => {
                          if (isUsageLimitReached) {
                            setShowNotification(true);
                            console.log('Usage limit reached');
                          } else {
                            console.log('Usage limit not reached');
                            router.push('/campaign-settings');
                          }
                        }}
                        className="rounded-md bg-violet-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                      >
                        New Chatbot
                      </button>

                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-4">
                    {campaigns.map((campaign, index) => {
                      console.log('this is campaign line 190', campaign);

                      return (
                        <div key={campaign.campaign_id} className="sm:w-1/1 w-full md:w-1/3 lg:w-1/4 xl:w-1/4">

                          <div className="bg-violet relative rounded-lg outline outline-1 outline-slate-200 transition-shadow hover:shadow-lg">
                            <Link href={`/campaign-settings?id=${campaign.campaign_id}`}>
                              <div className="chatbotPreview">
                                <div className="relative h-40 w-full overflow-hidden">
                                  <Image
                                    src="/images/image-not-found-scaled.png"
                                    alt="Illustration for quick chat"
                                    layout="fill"
                                    objectFit="cover"
                                  />
                                </div>
                              </div></Link>
                            <div className="chatbotInfo border-t p-4">
                              <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                  {campaign.chatbot_name}
                                </h2>
                                <div className="relative inline-block text-left">
                                  <div>
                                    <button
                                      onClick={() => toggleDropdown(campaign.campaign_id)}
                                      type="button"
                                      className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-1 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                                      id="options-menu"
                                      aria-haspopup="true"
                                      aria-expanded="true"
                                    >
                                      <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                  </div>

                                  <Transition
                                    show={campaign.dropdownOpen}
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                  >
                                    <div
                                      className="origin-top-right absolute right-0 mt-2 z-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                      role="menu"
                                      aria-orientation="vertical"
                                      aria-labelledby="options-menu"
                                    >
                                      <div className="py-1" role="none">
                                        <button
                                          onClick={() => {
                                            setCampaignToDelete(campaign.campaign_id);
                                            setConfirmDeleteOpen(true);
                                          }}
                                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                          role="menuitem"
                                        >

                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  </Transition>
                                </div>

                                <ConfirmDel
                                  open={confirmDeleteOpen}
                                  setOpen={setConfirmDeleteOpen}
                                  chatbotId={campaignToDelete}
                                  onDelete={deleteCampaign}
                                  deleting={deleting}
                                />
                              </div>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
