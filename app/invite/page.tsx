'use client'

import { useState, useEffect, useContext, useCallback } from 'react';
import Navbar from '@/app/components/ui/navbar';
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter, useSearchParams } from 'next/navigation';
import useNotification from '@/app/components/ui/notification';
import { GlobalContext } from '../context/context';
import useLangParam from '@/app/hooks/useLangParam';
import Spinner from '../components/ui/spinner';

export default function Dashboard() {
  const { state, dispatch } = useContext<any>(GlobalContext)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const supabase = useSupabaseClient();
  const user = useUser();
  const [notification, notify] = useNotification();
  const [loading, setLoading] = useState(false);
  const [invitedData, setInvitedData] = useState<any>({})
  const [workspace, setWorkspace] = useState<any>({})
  const [isNotValid, setIsNotValid] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [isAccepted, setIsAccepted] = useState(false)
  const [isRejected, setIsRejected] = useState(false)
  const params = useSearchParams()
  const workspace_id = params.get('workspace');
  const token = params.get('token');
  const to = params.get('to');
  const lang = useLangParam()
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(true)

  // console.log(workspace_id, token, to);


  const updateSubs = async (data) => {
    try {
      const res = await fetch('http://localhost:3000/api/updateSubscription', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`Status Error: ${res.status}`);
      const json = await res.json();
      return json
    } catch (error) {
      console.log(error);
    }
  }

  const inviteHandler = async (isAccept: boolean) => {
    try {
      let { data: workspaceData, error: workspaceErr } = await supabase
        .from('workspace')
        .select(`*`)
        .eq('id', workspace_id);

      const workspace = workspaceData![0]
      const members = workspace.members || []
      const members_detail = workspace.members_detail ?? {}
      const total_qty = Object.keys(members_detail).length

      const isalreadyMember = members.includes(to)

      if (workspaceErr || workspaceData!.length < 1 || isalreadyMember) {
        console.log(workspaceErr || (isalreadyMember && 'already member'));
        throw new Error('workspace error');
      }

      let { data: inviteData, error: inviteErr } = await supabase
        .from('invite')
        .update({
          status: isAccept ? 'accepted' : 'rejected',
        })
        .eq('id', token)
        .select('*')

      if (inviteErr) {
        console.log(inviteErr);
        throw new Error('invite error');
      }

      if (!isAccept) {
        setIsRejected(true)
        return
      }
      const { data, error } = await supabase.from('users').select('*').eq('id', inviteData![0].user_id).single()
      if (error) throw error
      const userData = data!
      const { subscription_status, price_id, sub_id, qty } = userData
      // how many seats are availabel if there are not enough seat then charge otherwise use availabel seats 
      if (subscription_status === 'pro' && qty <= total_qty) {
        await updateSubs({ price_id, sub_id, qty: qty + 1 })
      }

      members_detail[String(user?.email)] = {
        email: user?.email,
        picture: user?.user_metadata.picture,
        full_name: user?.user_metadata.full_name,
        role: inviteData![0].role
      }

      let { data: updatedWorkspaceData, error: updatedWorkspaceErr } = await supabase
        .from('workspace')
        .update({
          members: [...members, to],
          members_detail: members_detail
        })
        .eq('id', workspace.id);
      setIsAccepted(true)

    } catch (error) {
      console.log(error);
    }

  }

  const linkHandler = async () => {
    try {
      let { data: inviteData, error: inviteErr } = await supabase
        .from('invite')
        .select('*')
        .eq('id', token);

      let { data: workspaceData, error: workspaceErr } = await supabase
        .from('workspace')
        .select(`*`)
        .eq('id', workspace_id);

      if ((inviteErr || inviteData!.length < 1) || (workspaceErr || workspaceData!.length < 1)) {
        console.log(inviteErr, 'inviteErr' || workspaceErr, 'workspaceErr');
        setIsNotValid(true)
        throw new Error('link error');
      }
      const invite = inviteData![0]
      const workspace = workspaceData![0]

      const isAccepted = invite.status === 'accepted' ? true : false
      isAccepted ? setIsAccepted(isAccepted) : setIsRejected(isAccepted)

      const isExpired = Date.now() > new Date(invite.expires_at).getTime() ? true : false

      if (isExpired) {
        setIsExpired(isExpired)
        throw new Error('link expired');
      }

      setInvitedData(invite)
      setWorkspace(workspace)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("this is logging session and session.user", session && session.user);
        if (!session && !session!.user) {
          linkHandler()
        } else {
          router.push(`${lang}/login`);
        }
      }
    );

    // Cleanup function: removes the listener when the component is unmounted
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth, router, user]); // Add `user` here


  return (
    <div>
      {notification as JSX.Element}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {!sidebarOpen &&
        <main className="lg:pl-72">
          <section className='mt-2 px-4 sm:px-8 md:px-12 lg:px-24'>
            <h2 className="text-2xl pt-8 font-medium">{loading ? 'loading....' : 'Invitations'}</h2>
            <hr className='mb-8 mt-8' />
            <div className='w-auto' >
              {
                loading ?
                  'loading....' :
                  isNotValid ?
                    <div>Link is not valid</div> :
                    isExpired ?
                      <div>Link is Expired</div> :
                      isAccepted ?
                        <div>Link is already accepted</div> :
                        isRejected ?
                          <div>Link is rejected</div> :
                          <div className='flex flex-col items-center' >
                            <h2>You have been invited to join {workspace.workspace_name}'s workspace</h2>
                            <div>
                              <button
                                onClick={() => inviteHandler(true)}
                                className="mx-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => inviteHandler(false)}
                                className="mx-1 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
              }
            </div>
          </section>
          <div className="px-4 sm:px-6 lg:px-8"></div>
        </main>
      }
    </div>
  );
}