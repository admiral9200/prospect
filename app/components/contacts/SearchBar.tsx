import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar = () => {
    return (
        <div className="relative lg:ml-4 rounded-md shadow-sm w-[380px]">
            <input
                type="text"
                name="account-number"
                id="account-number"
                className="block w-full text-sm rounded-md border-0 py-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-black placeholder:opacity-80 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Search Campaign"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-black font-bold" aria-hidden="true" />
            </div>
        </div>
    )
}

export default SearchBar;