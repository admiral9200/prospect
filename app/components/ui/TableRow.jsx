import React from 'react'

const TableRow = ({ imageUrl, memberName, memberEmail, isAdmin, isOwner, isPending, children }) => {
    return (
        <div className="border-2 rounded-xl my-1"  >
            <div className="relative p-4 flex items-center gap-4  rounded-xl bg-transparent bg-clip-border  text-gray-700">
                <img
                    src={imageUrl ? imageUrl : 'https://freesvg.org/img/abstract-user-flat-4.png'}
                    alt="profile pic"
                    className="relative inline-block h-12 w-12 !rounded-full object-cover object-center"
                />
                <div className="flex justify-between items-center w-full ">
                    <div className=" ">
                        <h5 className="block font-sans text-lg font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                            {memberName} {
                                isPending ? <span className={`bg-red-200 rounded-sm text-red-600 p-1 text-xs`} >Pending</span> :
                                    isAdmin ?
                                        <span className=" bg-gray-200 rounded-sm text-gray-600 p-1 text-xs" >Admin</span> :
                                        isOwner ?
                                            <span className=" bg-gray-200 rounded-sm text-gray-600 p-1 text-xs" >Owner</span> :
                                            <span className=" bg-gray-200 rounded-sm text-gray-600 p-1 text-xs" >Member</span>

                            }
                        </h5>
                        <p className=" text-gray-600 text-sm font-sans ">
                            {memberEmail}
                        </p>
                    </div>
                    {!isAdmin ? children : null}

                    {/* <MENU icon={<PencilIcon className={`h-5 w-5 text-gray-600 cursor-pointer `} />} /> */}
                </div>
            </div>
        </div>

    )
}

export default TableRow