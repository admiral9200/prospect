import Image from "next/image";
import { useState } from "react";

interface SearchBarProps {
    visible: boolean,
    filtered: boolean,
    handleChange: any,
    handleCloseSearchBar: any
}

const SearchBar = ({ visible, handleChange, filtered, handleCloseSearchBar }: SearchBarProps) => {
    const [keyword, setKeyword] = useState<string>("");
    

    const switchSearchButton = () => {
        if (!filtered) {
            return (
                <button className="block absolute top-5 right-4 opacity-70">
                    <Image
                        src={'/search.svg'}
                        width={18}
                        height={18}
                        alt=""
                    />
                </button>
            )
        }
        if (filtered) {
            return (
                <button 
                    className="block absolute top-5 right-4 opacity-70"
                    onClick={handleCloseSearchBar}
                >
                    <Image
                        src={'/close.svg'}
                        width={18}
                        height={18}
                        alt=""
                    />
                </button>
            )
        }
    }

    return (
        <div className={`relative ${visible ? '' : 'hidden'}`}>
            <input
                type="text"
                className="w-full border-gray-300 rounded-md py-4"
                placeholder="Search by name, creator or sender"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleChange}
            />

            {
                switchSearchButton()
            }
        </div>
    )
}

export default SearchBar;