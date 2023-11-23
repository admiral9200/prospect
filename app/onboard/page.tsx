'use client'

import { useCallback, useEffect, useState } from 'react';
import Navbar from '@/app/components/ui/navbar';
import useNotification from '@/app/components/ui/notification';
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

import StepBar from '../components/onboard/Stepbar';
import DescribeItem from '../components/onboard/describeItem';
import UserValue from '../components/onboard/UserValue';
import Connector from '../components/onboard/Connector';

const items = [
  'Sales Development Representative',
  'Account Manager',
  'Sales Executive',
  'Agency Executive',
  'Recruiter',
  'Founder',
  'Other'
];


export default function Onboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [state, setState] = useState(1);
  const [describeItem, setDescribeItem] = useState(0);
  const [preposition, setPreposition] = useState("");

  // gmail, linkedin connection state...
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [isLinkedInConnected, setIsLinkedInConnected] = useState(false);

  const [notification, notify] = useNotification();

  // supabase hook
  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    const fetchUserType = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user type:', error);
          return;
        }

        if (data && !data.user_type) {
          return;
        } else if (data && data.user_type) {
          items.forEach((item, index) => {
            if (item == data.user_type) {
              setDescribeItem(index + 1);
            }
          })
          setState(2);
        }
      }
    }

    fetchUserType();
  }, [])

  /**
   * @desc fetching the user value in step 2
   */
  useEffect(() => {
    if (state == 2) {
      const fetchUserValue = async () => {
        if (user) {
          const { data, error } = await supabase
            .from('users')
            .select('user_value')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching user type:', error);
            return;
          }

          if (data && !data.user_value || data.user_value == undefined) {
            return;
          } else if (data && data.user_value) {
            setPreposition(data.user_value)
            setState(2);
          }
        }

      }

      fetchUserValue();
    }
  }, [state])

  const updateUserType = async () => {
    if (!user) {
      console.log("no user onboard");
      return;
    }

    let { error } = await supabase
      .from('users')
      .update({ user_type: items[describeItem - 1] })
      .eq('id', user.id);

    if (error) {
      console.log('Error User Type Setting:', error);
      return;
    }

    if (!error) {
      setState(state + 1);
    }
  }

  const updateUserValue = async () => {
    if (!user) {
      console.log("no user onboard");
      return;
    }

    let { error } = await supabase
      .from('users')
      .update({ user_value: preposition })
      .eq('id', user.id);

    if (error) {
      console.log('Error User Type Setting:', error);
      return;
    }

    if (!error) {
      setState(state + 1);
    }
  }

  const handleStep = (sign: string) => {
    if (sign == '+') {
      if (state == 1) {
        updateUserType();
      }

      if (state == 2) {
        updateUserValue();
      }

      if (state == 3) {
        setState(1)
      }
    } else {
      setState(state - 1);
    }

  }

  const toggleStyle = () => {
    if (state == 1) {
      if (describeItem == 0) {
        return ' cursor-not-allowed bg-gray-200 text-gray-400';
      } else {
        return ' bg-indigo-600 text-white';
      }
    } else if (state == 2) {
      if (preposition.length > 0) {
        return ' bg-indigo-600 text-white'
      } else {
        return ' cursor-not-allowed bg-gray-200 text-gray-400';
      }
    } else if (state == 3) {
      if (isLinkedInConnected) {
        return ' bg-indigo-600 text-white';
      } else {
        return ' cursor-not-allowed bg-gray-200 text-gray-400';
      }
    }
  }

  return (
    <div className="h-screen flex flex-col lg:justify-center">
      {notification as JSX.Element}
      {/* @ts-ignore */}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {!sidebarOpen &&
        <main className="flex justify-center items-center">
          <div className="px-4 sm:px-6 lg:px-4">
            <StepBar step={state} />
            <div className='w-full'>
              {
                state == 1 &&
                <div className='w-[400px]'>
                  <h2 className='text-[24px] font-bold'>What describes you best?</h2>
                  <p className='opacity-50 text-[12px] mb-4'>Please select the best one for you</p>
                  {
                    items.map((item, index) => <DescribeItem selected={describeItem} key={index} setDescribeItem={setDescribeItem} describe={describeItem} item={item} index={index} />)
                  }
                </div>
              }
              {
                state == 2 && <UserValue setPreposition={setPreposition} preposition={preposition} />
              }
              {
                state == 3 && <Connector
                  isGmailConnected={isGmailConnected}
                  setIsGmailConnected={setIsGmailConnected}
                  isLinkedInConnected={isLinkedInConnected}
                  setIsLinkedInConnected={setIsLinkedInConnected}
                />
              }

              <button className={`mt-2 w-full h-12 rounded-md font-bold ${toggleStyle()}`} onClick={() => handleStep('+')}>
                Next
              </button>
              <button className={`mt-1 w-full h-12 rounded-md bg-gray-200 font-bold text-gray-400 hover:text-gray-700 hover:bg-gray-100 ${state == 1 ? 'hidden' : ''}`} onClick={() => handleStep('-')}>
                Back
              </button>
            </div>

          </div>
        </main>
      }
    </div>
  );
}