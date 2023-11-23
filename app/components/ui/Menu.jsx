import { useState } from 'react'
import React from 'react'


const Menu = ({ icon, children }) => {
    const [isOpen, setIsOpen] = useState(false)

    const childrenWithProps = React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
            handleModal: () => {
                setIsOpen(!isOpen);
            }
        });
    });

    return (
        <div>
            <div onClick={() => children ? setIsOpen(!isOpen) : null} >
                {icon}
            </div>
            {
                isOpen ? <ul
                    className="absolute z-10 min-w-[150px] overflow-auto rounded-md border border-blue-gray-50 bg-white p-3 font-sans text-sm font-normal text-blue-gray-500 shadow-lg shadow-blue-gray-500/10 focus:outline-none"
                >
                    {childrenWithProps}
                </ul> : null
            }
        </div>
    )
}

export default Menu