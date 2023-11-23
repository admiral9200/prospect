interface SortBoxProps {
    visible: boolean,
    setSortCategory: any
}

const SortBox = ({ visible, setSortCategory }: SortBoxProps) => {

    return (
        <div className={`${visible ? 'absolute top-14 left-[-50px] z-20 bg-white w-[180px] lg:w-[250px] h-auto shadow-2xl rounded-2xl' : 'hidden'}`}>
            <div>
                <h4 className="pl-4 pt-3 mb-3 font-bold text-lg">Sort</h4>
            </div>
            <div>
                <button 
                    className="pl-4 py-2 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onClick={() => setSortCategory('name')}
                >
                    Name
                </button><br />
                <button 
                    className="pl-4 py-2 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onClick={() => setSortCategory('email')}
                >
                    Email
                </button><br />
                <button 
                    className="pl-4 py-2 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onClick={() => setSortCategory('phone')}
                >
                    Phone Number
                </button><br />
                <button 
                    className="pl-4 py-2 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onClick={() => setSortCategory('last_interaction')}
                >
                    Last Interaction
                </button><br />
                <button 
                    className="pl-4 py-2 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onClick={() => setSortCategory('title')}
                >
                    Title
                </button><br />
                <button className="pl-4 py-2 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]">Status</button><br />
                <button 
                    className="pl-4 py-2 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onClick={() => setSortCategory('company')}
                >
                    Company
                </button><br />
            </div>
        </div>
    )
}

export default SortBox;