'use client'

import { useState, useEffect, useContext, useCallback } from 'react';
import Navbar from '@/app/components/ui/navbar';
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import useNotification from '@/app/components/ui/notification';
import Table from '@/app/components/ui/Table';
import InviteMemberModal from '@/app/components/ui/InviteMemberModal';
import ChangeRoleModal from '@/app/components/ui/ChangeRoleModal';
import ConfirmSub from '@/app/components/workspace/ConfirmSub';
import { GlobalContext } from '../context/context';
import { v4 as uuidv4 } from 'uuid';
import useWorkspace from '../hooks/useWorkspace';

export default function Workspace() {
  const { state, dispatch } = useContext<any>(GlobalContext)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const supabase = useSupabaseClient();
  const user = useUser();
  const [notification, notify] = useNotification();
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [roleModal, setRoleModal] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState('')
  const { pendingMembersHandler } = useWorkspace()
  const [confirmSub, setConfirmSub] = useState(false)
  const [openConfirmModal, setOpenConfirmModal] = useState(false)

  const closeHandler = () => {
    setModalOpen(false)
  }
  const closeRoleHandler = () => {
    setRoleModal(false)
  }
  const openConfimModalHandler = async () => {
    const total_qty = Object.keys(state?.selected_workspace[0]?.members_detail).length
    const { data, error } = await supabase.from('users').select('*').eq('id', user?.id).single()
    if (error) throw error
    const userData = data!
    const { subscription_status, qty } = userData
    if (subscription_status === 'pro' && qty <= total_qty) {
      setOpenConfirmModal(true);
    } else {
      openHandler()
    }
  };
  const openHandler = async () => {
    try {
      // const { data, error } = await supabase.from('users').select('*').eq('id', user?.id).single()
      // if (error) throw error
      // const userData = data!
      // const { price_id, sub_id, seats } = userData

      setModalOpen(true);
    } catch (error) {

    }
  };
  const openRoleHandler = async (email) => {
    setSelectedEmail(email)
    setRoleModal(true);
  };

  const handleInvite = async (name, email, role) => {
    try {
      if (!user) throw new Error("user is required");
      if (!state.workspace_id) throw new Error("workspace_id is required");
      if (!name || !email || !role) throw new Error("missing required values name || role || email");

      const id = uuidv4()
      const invitationData = {
        workspace_id: state.workspace_id,
        id: id,
        name: name,
        invited_email: email,
        user_id: user?.id,
        expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        role: role,
        status: 'pending',
        link: `https://prosp.ai/invite/?workspace=${state.workspace_id}&token=${id}&to=${email}`
      };

      let { error } = await supabase.from('invite').insert([invitationData]);
      if (error) {
        console.log('invite user error', error);
        throw new Error("invite user error");
      }
      const res = await fetch('/api/invite', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          name: name,
          email: invitationData.invited_email,
          link: invitationData.link
        })
      })
      if (!res.ok) {
        throw new Error("Couldn't send invitation");
      }

    } catch (error) {
      console.log(error);
    }
    closeHandler()
  }

  const memberRoleHandler = async (role) => {
    console.log(selectedEmail, role);
    if (role != 'owner' && role != 'member') {
      return
    }

    const workspace = state.selected_workspace[0]
    workspace.members_detail[selectedEmail].role = role

    let { error } = await supabase
      .from('workspace')
      .update({
        members_detail: workspace.members_detail
      })
      .eq('id', workspace.id)

    if (error) {
      console.log('cannot update member role', error);
      throw new Error("update member role error");
    }
    console.log(workspace, 'memberRoleHandler workspace');
    dispatch({
      type: 'SELECTED_WORKSPACE',
      payload: [workspace]
    })
    // await getWorkspace()
  }

  const removeMemberHandler = async (email: string) => {
    const workspace = state.selected_workspace[0]
    const filtered_members = workspace.members.filter(m => m != email)
    delete workspace.members_detail[email]
    workspace.members = filtered_members

    let { error } = await supabase
      .from('workspace')
      .update({
        members: filtered_members,
        members_detail: workspace.members_detail
      })
      .eq('id', workspace.id)

    if (error) {
      console.log('delete member error', error);
      throw new Error("invite member error");
    }

    dispatch({
      type: 'USER_WORKSPACE',
      payload: [workspace]
    })
  }

  useEffect(() => {
    if (!user || !state.workspace_id) return
    pendingMembersHandler()
  }, [user, state.workspace_id])


  return (
    <div>
      {notification as JSX.Element}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {modalOpen && (
        <InviteMemberModal onClose={closeHandler} onConfirm={handleInvite} isEdit={false} />
      )}
      {roleModal && (
        <ChangeRoleModal onClose={closeRoleHandler} onConfirm={memberRoleHandler} isEdit={false} />
      )}

      {!sidebarOpen &&
        <main className="lg:pl-72">
          <section className='mt-2 px-4 sm:px-8 md:px-12 lg:px-24'>
            <h2 className="text-2xl pt-8 font-medium">{state?.selected_workspace[0]?.workspace_name}'s Workspace</h2>
            <hr className='mb-8 mt-8' />
            <Table title='Member List'
              removeHandler={removeMemberHandler}
              memberHandler={memberRoleHandler}
              openHandler={openConfimModalHandler}
              openRoleHandler={openRoleHandler} />
          </section>
        </main>
      }

      <ConfirmSub open={openConfirmModal} setOpen={setOpenConfirmModal} handleSub={setConfirmSub} openHandler={openHandler} />
    </div>
  );
}