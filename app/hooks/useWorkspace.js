import { useContext, useState } from "react";
import { GlobalContext } from '../context/context'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';


const useWorkspace = () => {
    const { state, dispatch } = useContext(GlobalContext)

    const supabase = useSupabaseClient();
    const user = useUser();

    const [loading, setLoading] = useState(false);
    const [workspaces, setworkspaces] = useState(state.workspace)

    const handleWorkspaceId = (id) => {
        // console.log(id);
        dispatch({
            type: "WORKSPACE_ID",
            payload: id
        })
        let selectedWorkspace = state.workspace.filter(w => (
            w.id === id
        ))
        selectedWorkspace.length > 0 ? dispatch({
            type: "WORKSPACE_NAME",
            payload: selectedWorkspace[0]?.workspace_name
        }) : null
        selectedWorkspace = state.workspace.filter(w => (
            w.members_detail[user.email]?.role === 'owner' &&
            w.id === id
        ))
        // console.log(selectedWorkspace);
        selectedWorkspace.length > 0 ? dispatch({
            type: "SELECTED_WORKSPACE",
            payload: [...selectedWorkspace]
        }) : null
    }

    const getWorkspace = async () => {
        try {
            setLoading(true);
            let { data: userWorkspace, error: userWorkspaceErr } = await supabase
                .from('workspace')
                .select('*')
                .eq('user_id', user.id)
            console.log(userWorkspace, 'userWorkspace', user.id);

            let { data: invitedWorkSpace, error: invitedWorkSpaceErr } = await supabase
                .from('workspace')
                .select('*')
                .contains('members', [user?.email])
            // console.log(invitedWorkSpace, 'invitedWorkSpace');


            let { data: usersinvitedMembers, error: usersinvitedMembersErr } = await supabase
                .from('invite')
                .select('*')
                .eq('workspace_id', state.workspace_id ? state.workspace_id : userWorkspace[0].id)
            usersinvitedMembers = usersinvitedMembers.filter(u => u.status === 'pending')
            console.log(usersinvitedMembers, 'usersinvitedMembers');

            if (userWorkspaceErr || invitedWorkSpaceErr) {
                console.log(invitedWorkSpaceErr, 'invitedWorkSpaceErr' || userWorkspaceErr, 'userWorkspaceErr');
                throw new Error('Something went wrong')
            }

            if (userWorkspace.length < 1 || invitedWorkSpace.length < 1) {
                console.log('invitedWorkSpaceEmpty or userWorkspaceEmpty');
                throw new Error('Something went wrong')
            }
            // console.log(data, 'workspaces');
            setworkspaces([...invitedWorkSpace])
            dispatch({
                type: 'USER_WORKSPACE',
                payload: [...userWorkspace]
            })
            dispatch({
                type: "WORKSPACE_NAME",
                payload: userWorkspace[0]?.workspace_name
            })
            dispatch({
                type: 'INVITED_MEMBERS',
                payload: [...usersinvitedMembers]
            })
            dispatch({
                type: 'SELECTED_WORKSPACE',
                payload: [...userWorkspace]
            })
            dispatch({
                type: 'WORKSPACE',
                payload: [...invitedWorkSpace]
            })
            handleWorkspaceId(userWorkspace[0].id)
        } catch (err) {
            console.log(err.message);
        }
        setLoading(false);
    };

    const pendingMembersHandler = async () => {
        try {
            if (!state.workspace_id) {
                console.log('workspace_id not found in state');
                return
            }
            let { data: usersinvitedMembers, error: usersinvitedMembersErr } = await supabase
                .from('invite')
                .select('*')
                .eq('workspace_id', state.workspace_id)
            usersinvitedMembers = usersinvitedMembers.filter(u => u.status === 'pending')
            console.log(usersinvitedMembers, 'usersinvitedMembers');
            dispatch({
                type: 'INVITED_MEMBERS',
                payload: [...usersinvitedMembers]
            })
        } catch (err) {
            console.log(err.message);
        }
    }


    return { loading, workspaces, getWorkspace, handleWorkspaceId, pendingMembersHandler }
}

export default useWorkspace