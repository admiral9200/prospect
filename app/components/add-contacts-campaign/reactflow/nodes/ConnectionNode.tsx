interface ConnectionNodeProps {
    open: boolean,
    setOpen: any
}

const ConnectionNode = ({ open, setOpen }: ConnectionNodeProps) => {
    return (
        <button 
            className="text-[#6039DB] bg-white w-5 h-5 flex justify-center items-center"
            onClick={() => setOpen(!open)}
        >
            <p>+</p>
        </button>
    )
}

export default ConnectionNode;