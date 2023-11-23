import React from 'react'

const MenuItem = ({ text, handleClick, handleModal }) => {
    return (<li onClick={() => {
        handleClick()
        handleModal()
    }}
        className=" text-black w-full cursor-pointer select-none rounded-md px-3 pt-[9px] pb-2 text-start leading-tight hover:bg-gray-200 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
        {text}
    </li>)
}

export default MenuItem