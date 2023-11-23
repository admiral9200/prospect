'use client'

import { Fragment, useState, useEffect, useCallback } from 'react';

import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import Navbar from '@/app/components/ui/navbar';
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import useNotification from '@/app/components/ui/notification';


function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}


export default function Onboarding() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const user = useUser();
  const [deleting, setDeleting] = useState<boolean>(false);
  const [notification, notify] = useNotification();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [isLinkedInUrlValid, setIsLinkedInUrlValid] = useState(true);
  const [valueProposition, setValueProposition] = useState('');
  const [linkedinData, setLinkedinData] = useState<any>({});

  const [isValuePropositionValid, setIsValuePropositionValid] = useState(true);


  useEffect(() => {
    if (name.length >= 2) {
      setIsNameValid(true);
    } else {
      setIsNameValid(false);
    }

    if (linkedInUrl.startsWith('https://www.linkedin.com/in/') && linkedInUrl.length > 'https://www.linkedin.com/in/'.length + 2 && !linkedInUrl.includes('username')) {
      setIsLinkedInUrlValid(true);
    } else {
      setIsLinkedInUrlValid(false);
    }
  }, [name, linkedInUrl]);

  useEffect(() => {
    if (valueProposition.length >= 2) {
      setIsValuePropositionValid(true);
    } else {
      setIsValuePropositionValid(false);
    }
  }, [valueProposition]);



  const fetchUserData = useCallback(async () => {
    setLoading(true);
    if (!user) {
      console.log('no user');
      return; // Early return if no user
    }

    const { data, error } = await supabase
      .from('users')
      .select(`user_name, user_linkedinprofile, user_value`)
      .eq('id', user.id)
      .single();

    if (error) {
      console.log('Error fetching user data', error);
      return;
    }

    if (data) {
      console.log("this is data", data)
      setName(data.user_name || '');
      setLinkedInUrl(data.user_linkedinprofile || 'https://www.linkedin.com/in/username/');
      setValueProposition(data.user_value || '');
    }

    setLoading(false);
  }, [user]);

  const updateProfile = async () => {

    if (!user) {
      console.log('No user available.');
      return;
    }

    console.log(`Attempting to update profile for user with ID: ${user.id}`);
    console.log(`New user_name: ${name}`);
    console.log(`New user_linkedinprofile: ${linkedInUrl}`);

    try {
      const response = await fetch("/api/scrapeProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: linkedInUrl }),
      });

      if (response.headers.get("Content-Type") === "application/json") {
        const responseData = await response.json();
        console.log(responseData);

        // // Update user data with LinkedIn ID from the response
        const { error: updateUserError } = await supabase
          .from('users')
          .update({
            avatar_url: responseData.data.imageUrl,
            user_linkedindata: responseData.data,
            user_linkedin_id: responseData.data.id,
            user_name: name,
            user_linkedinprofile: responseData.data.linkedinUrl,
            user_value: valueProposition
          })
          .eq('id', user.id);

        const { error: updateCampaignError } = await supabase
          .from('campaigns')
          .update({
            user_linkedin_id: responseData.data.id,
            user_name: name
          })
          .eq('user_id', user.id);

        if (updateUserError || updateCampaignError) {
          console.log('Error while updating LinkedIn ID:', updateUserError!.message || updateCampaignError);
        } else {
          console.log('LinkedIn ID updated successfully.');
        }

      } else {
        console.error(await response.text());
      }
    } catch (error) {
      console.error("Error fetching LinkedIn profile:", error);
    }
  }




  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("this is logging session and session.user", session && session.user);
        if (session && session.user) {
          fetchUserData();
        } else {
          router.push('/login');
        }
      }
    );

    // Cleanup function: removes the listener when the component is unmounted
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchUserData, supabase.auth, router, user]); //

  const canSubmit = () => isNameValid && isLinkedInUrlValid && isValuePropositionValid;


  return (
    <div className="h-screen flex flex-col lg:justify-center"> {/* This ensures the content is vertically centered */}
      {notification as JSX.Element}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {!sidebarOpen &&
        <main className="lg:pl-72 flex justify-center">
          <div className="px-4 sm:px-6 lg:px-8">
            <div>
              <h2 className=" pt-8 font-regular text-gray-700">
                Configure your profile
              </h2>
              <h1 className="text-2xl mt-2 font-medium text-black">
                Help us personalize your experience
              </h1>
              <div className='mt-4'>
                <label htmlFor="name" className="block font-medium leading-6 text-gray-900">
                  My name is...
                </label>
                <div className="relative mt-2 w-full rounded-md shadow-sm">
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    type="name"
                    name="name"
                    id="name"
                    className={` outline-none block w-full pl-4 rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ${isNameValid ? 'ring-violet-700' : 'ring-red-300'} placeholder:text-red-300 focus:ring-1 focus:ring-inset focus:ring-violet-700 sm: sm:leading-6`}
                    placeholder="John"
                    aria-invalid={!isNameValid}
                    aria-describedby="name-error"
                  />
                  {!isNameValid && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {!isNameValid && (
                  <p className="mt-2  text-red-600" id="name-error">
                    Please enter a valid name
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="linkedinurl" className="block mt-4 font-medium leading-6 text-gray-900">
                  LinkedIn Profile URL
                </label>
                <div className="relative mt-2 w-full rounded-md shadow-sm">
                  <input
                    defaultValue={linkedInUrl}
                    onChange={e => setLinkedInUrl(e.target.value)}
                    name="LinkedIn Profile URL"
                    id="linkedinurl"
                    className={`outline-none block w-full rounded-md pl-4 border-0 py-1.5 pr-10 text-black ring-1 ring-inset ${isLinkedInUrlValid ? 'ring-violet-400' : 'ring-red-300'} placeholder:text-red-300 focus:ring-1 focus:ring-inset focus:ring-violet-500 sm: sm:leading-6`}
                    placeholder="https://www.linkedin.com/in/username/"
                    aria-invalid={!isLinkedInUrlValid}
                    aria-describedby="linkedinurl-error"
                  />

                  {!isLinkedInUrlValid && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {!isLinkedInUrlValid && (
                  <p className="mt-2  text-red-600" id="linkedinurl-error">
                    Not a valid LinkedIn Profile
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="valueProposition" className="block mt-4 font-medium leading-6 text-gray-900">
                  My value proposition is...
                </label>
                <div className="relative mt-2 w-full rounded-md shadow-sm">
                  <input
                    value={valueProposition}
                    onChange={e => setValueProposition(e.target.value)}
                    name="valueProposition"
                    id="valueProposition"
                    className={` outline-none block w-full pl-4 rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ${isValuePropositionValid ? 'ring-violet-700' : 'ring-red-300'} placeholder:text-red-300 focus:ring-1 focus:ring-inset focus:ring-violet-700 sm: sm:leading-6`}
                    placeholder="I help sales people book more meetings with AI"
                    aria-invalid={!isValuePropositionValid}
                    aria-describedby="valueProposition-error"
                  />
                  {!isValuePropositionValid && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {!isValuePropositionValid && (
                  <p className="mt-2  text-red-600" id="valueProposition-error">
                    Please enter a valid value proposition
                  </p>
                )}
              </div>

              <button
                className={`mt-6 w-full h-12 rounded-md p-3 text-white ${canSubmit() ? 'bg-purple-700' : 'bg-gray-500'}  `}
                disabled={!canSubmit()}
                onClick={updateProfile}  // Add the onClick handler here
              >
                Save and get started
              </button>
              <section id="campaigns" className='flex flex-wrap gap-x-6'>

              </section>
            </div>
          </div>
        </main>
      }
    </div>
  );


}