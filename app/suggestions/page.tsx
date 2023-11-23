'use client'

import { useState, useEffect, useCallback } from 'react';
import Navbar  from '@/app/components/ui/navbar';
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import useNotification from '@/app/components/ui/notification';
import Analytics from '@/app/components/campaign/analytics';
import { TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link'

let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};


function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}


export default function Dashboard() {

  type SuggestionType = {
    avatar_url: string;
    title: string;
    description: string;
    user_name: string;
    user_linkedinprofile: string;
    user_id: string;
    id: number;
    score: number;
    voters: string[]; // array of user IDs who have voted for the suggestion
};

      
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const user = useUser();
  const [isUsageLimitReached, setIsUsageLimitReached] = useState(false);
  const [notification, notify] = useNotification();
  const [loading, setLoading] = useState(true);
  const [newSuggestionMode, setNewSuggestionMode] = useState(false);
  const [suggestionTitle, setSuggestionTitle] = useState("");
  const [suggestionDescription, setSuggestionDescription] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);
  const [votes, setVotes] = useState<number[]>([]);


  const [campaigns, setCampaigns] = useState<
  Array<{
    campaign_id: number | string;
    campaign_name: string | null;
  }>
>([]);


const handleVote = async (suggestionId: number) => {
  let suggestion = suggestions.find(s => s.id === suggestionId);
  let upvoted = suggestion && suggestion.voters.includes(user?.id || "");

  if (!suggestion) return;

  let newScore = upvoted ? -1 : 1;
  const updatedScore = suggestion.score + newScore;

  let updatedVoters = upvoted 
      ? suggestion.voters.filter(id => id !== user?.id) 
      : [...suggestion.voters, user?.id || ""];

  const { data, error } = await supabase
      .from('suggestions')
      .update({ score: updatedScore, voters: updatedVoters })
      .eq('id', suggestionId);

  if (error) {
    console.error("Error updating score:", error);
    return;
  }

  fetchSuggestions();
};


const deleteSuggestion = async (id) => {
    try {
      const { data, error } = await supabase
        .from('suggestions')
        .delete()
        .eq('id', id);
  
      if (error) {
        console.error("Error deleting suggestion:", error);
        return;
      }
        
      // Fetch suggestions again after deleting one
      fetchSuggestions();
  
    } catch (error) {
      console.error('Error deleting suggestion:', error);
    }
  };

const fetchSuggestions = async () => {
    
    if (!user) {
        console.log("No user found");
        return;
      }
  
  // First, get the user_name of the current logged in user
  const { data: currentUserData, error: currentUserError } = await supabase
  .from('users')
  .select('user_name')
  .eq('id', user?.id);

// Handle any errors fetching the user data
if (currentUserError || !currentUserData || currentUserData.length === 0) {
  console.error("Error fetching user data:", currentUserError);
  throw new Error("No user data available");
}

  // Fetch all suggestions, don't filter by user
  let { data: suggestionData, error: suggestionError } = await supabase
    .from('suggestions')
    .select(`*`);

// Handle any errors fetching the suggestions
if (suggestionError || !suggestionData) {
console.error("Error fetching suggestions:", suggestionError);
throw new Error("No suggestions available");
}

// Ensure that each suggestion's voters field is an array
suggestionData = suggestionData.map(suggestion => ({
...suggestion,
voters: suggestion.voters || []
}));

// Sort the suggestions by score in descending order (from highest to lowest)
suggestionData.sort((a, b) => b.score - a.score);

// Continue with the rest of your logic using currentUserData and suggestionData...
setSuggestions(suggestionData);
};

useEffect(() => {
    fetchSuggestions();
  }, [user]);
  

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


  const handleAddNewSuggestion = () => {
    setNewSuggestionMode(true);
  };

  const handleCancelNewSuggestion = () => {
    setNewSuggestionMode(false);
  };

  const saveNewSuggestion = async () => {
    try {
      // save to database
      let { data: userData, error: userError } = await supabase
        .from('users')
        .select(`user_name, user_linkedinprofile, avatar_url`)
        .eq('id', user?.id);

      if (userError || !userData || userData.length === 0) {
        console.error("Error fetching user data:", userError);
        return;
      }

      const { data, error } = await supabase
        .from('suggestions')
        .insert([
          { 
            title: suggestionTitle, 
            description: suggestionDescription, 
            user_name: userData[0].user_name, 
            user_linkedinprofile: userData[0].user_linkedinprofile, 
            avatar_url: userData[0].avatar_url,
            user_id: user?.id,
            score: 0
          },
        ]);

      if (error) {
        console.error("Error saving suggestion:", error);
        return;
      }
      
      // Reset suggestionTitle and suggestionDescription, and close the suggestion form
      setSuggestionTitle("");
      setSuggestionDescription("");
      setNewSuggestionMode(false);

      // Fetch suggestions again after saving a new one
      fetchSuggestions();

    } catch (error) {
      console.error('Error saving suggestion:', error);
    }
  };


  return (
    <div>
      {notification as JSX.Element}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {!sidebarOpen && 
        <main className="lg:pl-72">
          <section className='mt-2 px-4 sm:px-8 md:px-12 lg:px-24'>
            <h2 className="text-2xl pt-8 font-medium">Suggestions and issues</h2>
            <hr className='mb-8 mt-8'/>
            {
              newSuggestionMode 
                ? (
<div 
  style={{ 
    height: '280px',
    transition: 'height 0.5s ease-out'
  }} 
  className="flex flex-col bg-white border border-gray-200 rounded-xl p-4"
>
  <input className="mb-2 p-2 px-4" type="text" placeholder="Title" value={suggestionTitle} onChange={e => setSuggestionTitle(e.target.value)} />
  
  {suggestionTitle.length === 0 && <span className="text-red-500 pl-4 mb-4">Please add a title.</span>}
  
  <textarea className="mb-2 border rounded-md p-4 h-36" placeholder="Describe your suggestion or issue" value={suggestionDescription} onChange={e => setSuggestionDescription(e.target.value)} />
  <div className="flex justify-end">
    <button onClick={handleCancelNewSuggestion} className="mr-2 px-4 py-2 bg-white border text-black font-medium rounded">Cancel</button>
    <button disabled={suggestionTitle.length === 0} onClick={saveNewSuggestion} className="px-4 py-2 bg-violet-700 text-white rounded font-medium">Publish</button>
  </div>
</div>

                )
                : (
                  <div 
                    onClick={handleAddNewSuggestion} 
                    style={{ 
                      height: '100px', 
                      transition: 'height 0.5s ease-out'
                    }} 
                    className="flex items-center justify-center bg-purple-50 border border-gray-200 border-dashed rounded-xl cursor-pointer"
                  >
                    <p className="m-0 text-lg font-medium text-center">+ Add a New Suggestion</p>
                  </div>
                )
            }
          </section>
<section className='mt-6 px-4 sm:px-8 md:px-12 lg:px-24'>
  <div className=''>
    {suggestions.map((suggestion, index) => (
      <div 
        key={index}
        className="px-5 flex items-start border rounded-xl justify-start mb-4 py-4"

      >
        <div className='border shrink-0 h-20 w-14 rounded-3xl flex flex-col items-center justify-center '>
          <div>
            {
              (suggestion.user_id === user?.id) ?
              (
                <button onClick={() => deleteSuggestion(suggestion.id)}>
                  <TrashIcon className="h-6 w-6 text-gray-600" />
                </button>
              ) :
              (
<button onClick={() => handleVote(suggestion.id)}>
    {
      (suggestion.voters.includes(user?.id || "")) ?
      (
        // This is the SVG for when the user has already upvoted the suggestion
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.8988 10.1625C16.0519 9.83625 18.0956 9.87937 18.6938 9.9225C19.74 9.9975 20.7863 9.975 20.9663 11.2444C21.0863 12.0994 20.7994 12.8775 19.5319 13.0162C19.0856 13.065 18.54 13.0912 18.09 13.1625L17.7375 13.5506C18.1538 13.4944 19.1081 13.5131 19.395 13.4775C20.6063 13.3294 21.63 13.815 21.7838 14.9794C21.9188 15.9994 21.15 16.7869 20.0588 16.7269C19.6856 16.7062 18.6319 16.8506 17.5856 16.8787L17.505 17.0906L17.4675 17.1544C18.1313 17.1731 18.7669 17.1994 19.2188 17.2219C20.4281 17.2819 21.0881 17.9306 21.0713 18.7931C21.0506 19.8412 20.07 20.235 19.3688 20.2931C18.8438 20.3362 16.965 20.2819 15.7031 20.1787L15.5044 20.5181C15.5944 20.52 18.0113 20.6362 18.1031 20.6419C19.2113 20.7244 19.6838 21.1256 19.6556 21.9169C19.6163 23.0269 18.4313 23.3212 17.79 23.4225C16.7494 23.5875 15.3619 23.5387 14.3513 23.5669C12.165 23.6269 7.69127 23.7244 5.60252 21.8944C4.89002 21.27 4.17189 20.4206 3.56064 20.1769C2.28002 19.6669 2.16939 17.9981 2.22752 15.8887C2.25564 14.8687 1.90502 12.0056 3.14252 11.3119C4.87877 10.3387 7.82252 9.60375 8.80127 8.835C10.4063 7.57312 11.3438 5.52 11.7713 4.31812C12.585 2.02875 12.8325 0.375 14.2556 0.375C16.7494 0.375 16.6838 2.6025 16.7306 3.71625C16.8225 5.89687 14.1319 9.93187 14.8988 10.1625Z" fill="#FAC036"/>
<path d="M12.7537 15.1763C12.7781 16.2994 13.6443 16.7813 13.6837 16.8019C13.1868 16.7906 12.1106 17.295 12.1106 18.3656C12.1106 19.2488 12.5906 19.9369 13.0725 20.1713C12.7556 20.2388 12.1575 20.67 12.1575 21.6113C12.1575 22.9913 13.1812 23.4956 13.9556 23.5913C14.73 23.6869 16.8825 23.5575 17.5931 23.4488C17.9737 23.3906 15.7068 23.3644 14.0475 23.1469C13.5712 23.085 13.0031 22.6369 12.9112 22.0331C12.9112 22.0331 12.7762 21.2363 13.5037 20.7769C13.5037 20.7769 13.8112 20.5125 15.2381 20.5238L15.6693 20.5294C15.8043 20.5388 17.5275 20.5988 18.1012 20.64C18.3543 20.6588 18.5718 20.6944 18.7593 20.7469C18.7293 20.7038 18.6956 20.6325 18.7068 20.5294C18.7312 20.3119 18.8737 20.3025 18.9112 20.3025L18.57 20.2838L17.355 20.2144C16.1437 20.1413 14.4375 20.025 14.2406 19.9463C14.2406 19.9463 13.0518 19.6463 13.0518 18.4275C13.0518 18.4275 12.99 17.3906 14.5762 17.3419C14.5762 17.3419 18.3243 17.1263 19.9106 17.3363C19.9106 17.3363 19.6837 16.9144 20.0587 16.725C20.0587 16.725 17.3831 16.7906 15.7068 16.8356C14.0306 16.8806 13.6725 15.99 13.6293 15.5044C13.6237 15.4313 13.6087 15.315 13.6087 15.1781C13.6087 14.2125 14.4562 14.085 15.6693 13.9275C18.2868 13.5844 19.395 13.4775 19.395 13.4775C19.5393 13.4606 19.6762 13.4513 19.8093 13.4531C19.7362 13.4119 19.6368 13.335 19.6237 13.2075C19.6162 13.125 19.6575 12.9994 19.6575 12.9994C19.6575 12.9994 18.5287 13.0913 16.7868 13.3238C15.0468 13.5563 13.6556 13.4494 13.53 12.4313C13.4381 11.685 13.5637 11.2106 13.8862 10.8413C14.2837 10.3856 14.9231 10.1588 14.9231 10.1588C14.9231 10.1588 14.85 10.1438 14.8087 10.0894C14.7675 10.0331 14.7656 9.94501 14.7656 9.94501C13.3462 10.125 12.375 11.0269 12.4556 12.1856C12.5118 12.9788 12.7218 13.5075 13.2487 13.7644C13.2506 13.7625 12.7293 14.055 12.7537 15.1763Z" fill="#E48C15"/>
<path d="M13.3331 12.66L12.7106 12.84C12.7106 12.84 13.6331 16.2356 10.2281 18.5756C10.2281 18.5756 9.79118 18.8681 10.0031 19.0875C10.0031 19.0875 10.1512 19.3425 10.7774 18.8643C10.7774 18.8625 14.0999 16.695 13.3331 12.66Z" fill="#E48C15"/>
</svg>

      ) :
      (
        // This is the SVG for when the user has not upvoted the suggestion
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.8988 10.1625C16.0519 9.83625 18.0956 9.87937 18.6938 9.9225C19.74 9.9975 20.7863 9.975 20.9663 11.2444C21.0863 12.0994 20.7994 12.8775 19.5319 13.0162C19.0856 13.065 18.54 13.0912 18.09 13.1625L17.7375 13.5506C18.1538 13.4944 19.1081 13.5131 19.395 13.4775C20.6063 13.3294 21.63 13.815 21.7838 14.9794C21.9188 15.9994 21.15 16.7869 20.0588 16.7269C19.6856 16.7062 18.6319 16.8506 17.5856 16.8787L17.505 17.0906L17.4675 17.1544C18.1313 17.1731 18.7669 17.1994 19.2188 17.2219C20.4281 17.2819 21.0881 17.9306 21.0713 18.7931C21.0506 19.8412 20.07 20.235 19.3688 20.2931C18.8438 20.3362 16.965 20.2819 15.7031 20.1787L15.5044 20.5181C15.5944 20.52 18.0113 20.6362 18.1031 20.6419C19.2113 20.7244 19.6838 21.1256 19.6556 21.9169C19.6163 23.0269 18.4313 23.3212 17.79 23.4225C16.7494 23.5875 15.3619 23.5387 14.3513 23.5669C12.165 23.6269 7.69127 23.7244 5.60252 21.8944C4.89002 21.27 4.17189 20.4206 3.56064 20.1769C2.28002 19.6669 2.16939 17.9981 2.22752 15.8887C2.25564 14.8687 1.90502 12.0056 3.14252 11.3119C4.87877 10.3387 7.82252 9.60375 8.80127 8.835C10.4063 7.57312 11.3438 5.52 11.7713 4.31812C12.585 2.02875 12.8325 0.375 14.2556 0.375C16.7494 0.375 16.6838 2.6025 16.7306 3.71625C16.8225 5.89687 14.1319 9.93187 14.8988 10.1625Z" fill="#C7C7C7"/>
<path d="M12.7537 15.1763C12.7781 16.2994 13.6443 16.7813 13.6837 16.8019C13.1868 16.7906 12.1106 17.295 12.1106 18.3656C12.1106 19.2488 12.5906 19.9369 13.0725 20.1713C12.7556 20.2388 12.1575 20.67 12.1575 21.6113C12.1575 22.9913 13.1812 23.4956 13.9556 23.5913C14.73 23.6869 16.8825 23.5575 17.5931 23.4488C17.9737 23.3906 15.7068 23.3644 14.0475 23.1469C13.5712 23.085 13.0031 22.6369 12.9112 22.0331C12.9112 22.0331 12.7762 21.2363 13.5037 20.7769C13.5037 20.7769 13.8112 20.5125 15.2381 20.5238L15.6693 20.5294C15.8043 20.5388 17.5275 20.5988 18.1012 20.64C18.3543 20.6588 18.5718 20.6944 18.7593 20.7469C18.7293 20.7038 18.6956 20.6325 18.7068 20.5294C18.7312 20.3119 18.8737 20.3025 18.9112 20.3025L18.57 20.2838L17.355 20.2144C16.1437 20.1413 14.4375 20.025 14.2406 19.9463C14.2406 19.9463 13.0518 19.6463 13.0518 18.4275C13.0518 18.4275 12.99 17.3906 14.5762 17.3419C14.5762 17.3419 18.3243 17.1263 19.9106 17.3363C19.9106 17.3363 19.6837 16.9144 20.0587 16.725C20.0587 16.725 17.3831 16.7906 15.7068 16.8356C14.0306 16.8806 13.6725 15.99 13.6293 15.5044C13.6237 15.4313 13.6087 15.315 13.6087 15.1781C13.6087 14.2125 14.4562 14.085 15.6693 13.9275C18.2868 13.5844 19.395 13.4775 19.395 13.4775C19.5393 13.4606 19.6762 13.4513 19.8093 13.4531C19.7362 13.4119 19.6368 13.335 19.6237 13.2075C19.6162 13.125 19.6575 12.9994 19.6575 12.9994C19.6575 12.9994 18.5287 13.0913 16.7868 13.3238C15.0468 13.5563 13.6556 13.4494 13.53 12.4313C13.4381 11.685 13.5637 11.2106 13.8862 10.8413C14.2837 10.3856 14.9231 10.1588 14.9231 10.1588C14.9231 10.1588 14.85 10.1438 14.8087 10.0894C14.7675 10.0331 14.7656 9.94501 14.7656 9.94501C13.3462 10.125 12.375 11.0269 12.4556 12.1856C12.5118 12.9788 12.7218 13.5075 13.2487 13.7644C13.2506 13.7625 12.7293 14.055 12.7537 15.1763Z" fill="#626161"/>
<path d="M13.3331 12.66L12.7106 12.84C12.7106 12.84 13.6331 16.2356 10.2281 18.5756C10.2281 18.5756 9.79118 18.8681 10.0031 19.0875C10.0031 19.0875 10.1512 19.3425 10.7774 18.8643C10.7774 18.8625 14.0999 16.695 13.3331 12.66Z" fill="#626161"/>
</svg>


      )
    }
  </button>

)
}
</div>
<div>
<span className='font-semibold'>{suggestion.score}</span>
</div>
</div>

<div className='flex flex-col ml-4'>
<div>
<h2 className="text-xl font-semibold">{suggestion.title}</h2>
<p className="text-gray-600 mt-1">{suggestion.description}</p>
</div>
<div className="mt-4 flex items-center">
    <Link target="_blank" rel="noopener noreferrer" href={suggestion.user_linkedinprofile}>
      <div className='flex'>
      <img 
        src={suggestion.avatar_url || '/no-profile-picture.svg'} 
        alt="User Avatar"
        className="w-6 h-6 rounded-full"
        style={{ objectFit: 'cover' }}
      />
      <p className="ml-2">Posted by {suggestion.user_name}</p>
      </div></Link>
</div>
</div>
</div>
))}
</div>
</section>


          <div className="px-4 sm:px-6 lg:px-8"></div>
        </main>
      }
    </div>
  );
}