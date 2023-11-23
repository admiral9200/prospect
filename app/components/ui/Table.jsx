'use client'
import { GlobalContext } from "@/app/context/context";
import { UserPlusIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { useUser } from "@supabase/auth-helpers-react";
import { useContext } from "react";
import TableRow from '@/app/components/ui/TableRow'
import Menu from '@/app/components/ui/Menu'
import MenuItem from '@/app/components/ui/MenuItem'


export default function WorkspaceTable({ title, openHandler, removeHandler, openRoleHandler, memberHandler }) {
    const { state } = useContext(GlobalContext)
    const members = state?.selected_workspace[0]?.members || []
    const invited_members = state?.invited_members || []
    const members_detail = state.selected_workspace[0]?.members_detail ?? {}
    const total_members = Object.keys(members_detail).length
    const user = useUser()
    return (
        <div className="">
            <div className="mb-2">
                <div className="flex justify-between w-full ">
                    <h1 className=" font-bold text-2xl text-black " >Invite a member</h1>

                    {
                        true ?
                            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                                <button
                                    className="middle none center mr-3 rounded-lg bg-gray-700 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-500/20 transition-all hover:shadow-lg hover:shadow-black-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"

                                >
                                    <span onClick={openHandler} className="flex items-center" >
                                        <UserPlusIcon strokeWidth={2} className="h-4 w-4 mx-1 " />
                                        Add Member
                                    </span>
                                </button>
                            </div> :
                            null
                    }

                </div>
                <p className=" text-gray-700 my-2" >Invite a member to start collaborating on folk.Manage member and set their access level.</p>

                <p className="text-gray-500 text-sm mt-4 " >{total_members} workspace members</p>

            </div>

            {members.map(
                (member, index) => {

                    return (
                        <TableRow
                            key={member}
                            imageUrl={members_detail[member]?.picture}
                            memberName={members_detail[member]?.full_name}
                            memberEmail={members_detail[member]?.email}
                            isAdmin={members_detail[member]?.is_admin}
                            isOwner={members_detail[member]?.role === 'owner'} >
                            {
                                !members_detail[member]?.is_admin || true ?
                                    <Menu icon={<EllipsisHorizontalIcon className={`h-7 w-7 text-gray-600 cursor-pointer `} />} >
                                        <MenuItem text='Remove' handleClick={() => removeHandler(members_detail[member]?.email)} />
                                        <MenuItem text='Change Role' handleClick={() => {
                                            openRoleHandler(members_detail[member]?.email)
                                            // memberHandler(members_detail[member]?.email)
                                        }} />
                                    </Menu>
                                    : null
                            }

                        </TableRow>
                    );
                },
            )}
            {invited_members.map(
                (member, index) => {

                    return (
                        <TableRow
                            key={member}
                            imageUrl={false}
                            memberName={member.name}
                            memberEmail={member.invited_email}
                            isAdmin={members_detail[member]?.is_admin}
                            isOwner={members_detail[member]?.role === 'owner'}
                            isPending={member.status}
                        >
                        </TableRow>
                    );
                },
            )}
        </div>


    );
}