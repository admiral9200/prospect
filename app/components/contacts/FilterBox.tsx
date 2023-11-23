import { useEffect, useState } from "react";
import DateFilterBox from "./filter/DateFilterBox";
import TextFilterBox from "./filter/TextFilterBox";

interface FilterBoxProps {
    visible: boolean,
    filterFunc: any
}

const FilterBox = ({ visible, filterFunc }: FilterBoxProps) => {
    const [visibleTextFilter, setVisibleTextFilter] = useState<boolean>(false);

    const [visibleDateFilter, setVisibleDateFilter] = useState<boolean>(false);

    const [filterType, setFilterType] = useState<string>("");

    useEffect(() => {
        if (!visible) {
            setVisibleTextFilter(false);
            setVisibleDateFilter(false);
        }
    }, [visible])

    const switchFilter = (type: string) => {
        if (type == "name") {
            setVisibleTextFilter(true);
            setVisibleDateFilter(false);
            setFilterType("name");
        }

        if (type == "email") {
            setVisibleTextFilter(true);
            setVisibleDateFilter(false);
            setFilterType("email");
        }

        if (type == "phone") {
            setVisibleTextFilter(true);
            setVisibleDateFilter(false);
            setFilterType("phone");
        }

        if (type == "last_interaction") {
            setVisibleTextFilter(false);
            setVisibleDateFilter(true);
            setFilterType("last_interaction");
        }

        if (type == "title") {
            setVisibleTextFilter(true);
            setVisibleDateFilter(false);
            setFilterType("title");
        }

        if (type == "status") {
            setVisibleTextFilter(true);
            setVisibleDateFilter(false);
            setFilterType("status");
        }

        if (type == "company") {
            setVisibleTextFilter(true);
            setVisibleDateFilter(false);
            setFilterType("company");
        }
    }

    return (
        <div className={`${visible ? 'absolute top-14 left-0 z-20 bg-white w-[180px] lg:w-[250px] h-auto shadow-2xl rounded-2xl' : 'hidden'}`}>
            <div>
                <h4 className="pl-4 pt-2 mb-3 font-bold text-lg">Filters</h4>
            </div>
            <div className="relative">
                <button
                    className="pl-4 py-2 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onMouseOver={() => switchFilter("name")}
                >
                    Name
                </button><br />
                <button
                    className="pl-4 py-2 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onMouseOver={() => switchFilter("email")}
                >
                    Email
                </button><br />
                <button
                    className="pl-4 py-2 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onMouseOver={() => switchFilter("phone")}
                >
                    Phone Number
                </button><br />
                <button
                    className="pl-4 py-2 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onMouseOver={() => switchFilter("last_interaction")}
                >
                    Last Interaction
                </button><br />
                <button
                    className="pl-4 py-2 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onMouseOver={() => switchFilter("title")}
                >
                    Title
                </button><br />
                <button
                    className="pl-4 py-2 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onMouseOver={() => switchFilter("status")}
                >
                    Status
                </button><br />
                <button
                    className="pl-4 py-2 hover:bg-[#6039DB] hover:bg-opacity-10 w-full text-left font-medium text-[14px]"
                    onMouseOver={() => switchFilter("company")}
                >
                    Company
                </button><br />

                {/* additional filters */}
                <TextFilterBox type={filterType} visible={visibleTextFilter} filterFunc={filterFunc}/>
                <DateFilterBox type={filterType} visible={visibleDateFilter} filterFunc={filterFunc}/>
                {/* additional filters */}
            </div>
        </div>
    )
}

export default FilterBox;