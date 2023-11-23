'use client'

import { useState, useEffect, useCallback } from 'react';
import ChatbotProfile from '@/app/components/ui/chatbot_profile';
import ChatbotCard from '@/app/components/ui/chatbotCard';
import Link from 'next/link'
import { CheckIcon } from '@heroicons/react/20/solid'
import Navbar from '@/app/components/ui/navbar';
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import useNotification from '@/app/components/ui/notification';
const includedFeatures = [
  'Up to 4 campaigns',
  'Unlimited access',
  '24/7 e-mail support',
  'Outreach courses',
]

function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// const stripePromise = loadStripe('pk_live_51Nbd4jCZJfZkzemp7atosmRkJFP8Fd88JSLG8lqvqvCOt0TvlAZLFL1ixB6CyD5nij4IxOgutBAZIPxXthQArdJa00amIXfBiw');
const stripePromise = loadStripe('pk_test_51Nbd4jCZJfZkzemp41Ikkq5spby6Pc4gzA4S0VJ0jsAXisey6rveOCia2BIyjFKhOLrwrhStf2YawwceyckYOHfD0050Q6SKp9');


export default function Subscribe() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const user = useUser();

  const [notification, notify] = useNotification();
  const [loading, setLoading] = useState(true);
  const [creatingCampaign, setCreatingCampaign] = useState(false);

  const [campaigns, setCampaigns] = useState<
    Array<{
      campaign_id: number | string;
      campaign_name: string | null;
    }>
  >([]);




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
          router.push('/subscribe');
        }
      }
    }

    checkSubscriptionStatus();
  }, [user, supabase, router]);



  const redirectToCheckout = async (priceId) => {
    try {
      const response = await fetch('https://prosp.ai/api/checkout', {
        // const response = await fetch('http://localhost:3000/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: priceId, userId: user?.id }),
      });
      const json = await response.json();
      if (!response.ok) {
        console.log(json);
        throw new Error("Error Cannot procced with payment");
      }
      const { sessionId } = json


      const stripe = await stripePromise;
      await stripe!.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Failed to start payment:', error);
    }
  };




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

      setCampaigns(
        (campaignData || []).map((campaign) => ({ ...campaign, dropdownOpen: false }))
      );

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



  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("this is logging session and session.user", session && session.user);
        if (session && session.user) {
          getProfile();
        } else {
          router.push('/login');
        }
      }
    );

    // Cleanup function: removes the listener when the component is unmounted
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [getProfile, supabase.auth, router, user]); // Add `user` here





  return (
    <div>
      {/* Conditionally render the modal */}
      {notification as JSX.Element}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {!sidebarOpen &&
        <main className="lg:pl-72 pt-0 lg:pt-16">
          <div className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl sm:text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple no-tricks pricing</h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Upgrade now to send unlimited messages and start booking meetings ! 🪄
                </p>
                <div className='flex items-center justify-center'>
                  <ul
                    role="list"
                    className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
                  >
                    {includedFeatures.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckIcon className="h-6 w-5 flex-none text-violet-700" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-10 md:flex w-full p-2 items-center justify-center space-y-2 md:space-y-0 md:space-x-2 flex-shrink-0">
                  <div className="w-full md:w-1/2 rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                    <div className="mx-auto max-w-xs px-8">
                      <p className="text-base font-semibold text-gray-600">Annual Plan</p>
                      <p className="mt-6 flex items-baseline justify-center gap-x-2">
                        <span className="text-5xl font-bold tracking-tight text-gray-900">$29</span>

                        <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">USD</span>
                      </p>
                      <button
                        onClick={() => redirectToCheckout("price_1NspNqCZJfZkzempbPSSLCjI")}
                        className="mt-10 block w-full rounded-md bg-violet-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
                      >
                        Get access
                      </button>

                    </div>
                  </div>
                  <div className="w-full md:w-1/2 rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                    <div className="mx-auto max-w-xs px-8">
                      <p className="text-base font-semibold text-gray-600">Monthly Plan</p>
                      <p className="mt-6 flex items-baseline justify-center gap-x-2">
                        <span className="text-5xl font-bold tracking-tight text-gray-900">$49</span>
                        <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">USD</span>
                      </p>
                      <button
                        onClick={() => redirectToCheckout("price_1NspNqCZJfZkzempzGIl4YaI")}
                        className="mt-10 block w-full rounded-md bg-violet-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
                      >
                        Get access
                      </button>
                    </div>
                  </div>
                </div>


              </div>
              {/* <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:max-w-none">

          <div className="p-8 sm:p-10">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">Book thousands of meetings ! 🚀 </h3>
            <p className="mt-6 text-base leading-7 text-gray-600">
              A single plan to get access to all of our features.
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-violet-700">What’s included</h4>
              <div className="h-px flex-auto bg-gray-100" />
            </div>
            <ul
              role="list"
              className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
            >
              {includedFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-violet-700" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="-mt-2 md:flex w-full p-2 items-center justify-center space-y-2 md:space-y-0 md:space-x-2 flex-shrink-0">
            <div className="w-full md:w-1/2 rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600">Annual Plan</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">$29</span>
                  
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">USD</span>
                </p>
                <button
                   onClick={() => redirectToCheckout("price_1NbudwCZJfZkzemp5Xw5ajIy")}
                  className="mt-10 block w-full rounded-md bg-violet-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
                >
                  Get access
                </button>
               
              </div>
            </div>
            <div className="w-full md:w-1/2 rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600">Monthly Plan</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">$49</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">USD</span>
                </p>
                <button
                   onClick={() => redirectToCheckout("price_1NbudwCZJfZkzempT2priYqA")}
                  className="mt-10 block w-full rounded-md bg-violet-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
                >
                  Get access
                </button>
              </div>
            </div>
          </div>

        </div> */}
            </div>
          </div>

        </main>
      }
    </div>
  );



}