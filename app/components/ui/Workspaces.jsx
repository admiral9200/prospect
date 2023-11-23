import { useState, useEffect, useContext } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Spinner from '@/app/components/ui/spinner';
import { useTranslations } from 'next-intl';
import {
  ChevronUpDownIcon
} from '@heroicons/react/24/outline';
import { GlobalContext } from '@/app/context/context';

import Menu from '@/app/components/ui/Menu'
import MenuItem from '@/app/components/ui/MenuItem'
import useWorkspace from '@/app/hooks/useWorkspace';
import useLangParam from '@/app/hooks/useLangParam';
import { useRouter } from 'next/navigation';


const Workspace = () => {
  const { state, dispatch } = useContext(GlobalContext)
  const t = useTranslations('common')
  const user = useUser();
  const [isFetched, setIsFetched] = useState(state.workspace_id ? true : false)
  const { loading, workspaces, getWorkspace, handleWorkspaceId } = useWorkspace()
  const lang = useLangParam()
  const router = useRouter()


  useEffect(() => {
    // console.log(user, 'user.workspace');
    if (!user || isFetched ) return
    getWorkspace();
    setIsFetched(true)
  }, [user]);


  return (

    <section className="flex flex-col self-center rounded-lg border border-gray-200 bg-white p-4 mb-2 hover:border-gray-400 hover:bg-gray-200 hover:text-purple-700">
      {
        loading ? <Spinner color={undefined} size={undefined} message={'Loading Workspaces'} /> :
          <>
            <div className='flex justify-between' >
              <h3 className='text-sm font-semibold'>{state.workspace_name}'s Workspace</h3>
              <div className='flex content-center items-center' >
                <span className='text-sm font-semibold'>
                  {workspaces.length}
                </span>
                <Menu icon={<ChevronUpDownIcon className="h-6 cursor-pointer" />} >
                  {
                    workspaces?.map(w => {
                      return <MenuItem
                        key={w.id}
                        text={`${w.workspace_name}'s Workspace`}
                        handleClick={() => {
                          handleWorkspaceId(w.id)
                          // router.push(`${lang}/dashboard`)
                        }} />
                    })
                  }
                </Menu>
              </div>
            </div>
          </>
      }
    </section>
  );
};

export default Workspace;
