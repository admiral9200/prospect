
import Image from "next/image";
import FilterBox from "../contacts/FilterBox";
import SortBox from "../contacts/SortBox";
import SearchBar from "../contacts/SearchBar";
import { useState } from "react";
import CampaignTableRow from "./CampaignTableRow";
import ViewOptions from "./ViewOptions";

interface CampaignTableProps {
    colData: any,
    rowData: any
}

export default function CampaignTable({ colData, rowData }: CampaignTableProps) {
    console.log("11111", rowData)
    const [visibleSortBox, setVisibleSortBox] = useState<boolean>(false);
    const [visibleFilterBox, setVisibleFilterBox] = useState<boolean>(false);
    const [sortCategory, setSortCategory] = useState<string>('');
    const [visibleViewOptions, setVisibleViewOptions] = useState<boolean>(false);

    // table data...
    const [columns, setColumns] = useState<any>(colData);
    const [rows, setRows] = useState<any>(rowData);
    const [hideOrShowItems, setHideOrShowItems] = useState<any>([]);
    /**
     * @desc This function is used to handle all of the filters.
     * @param type 
     * @param keyword 
     * @param flag 
     */
    const handleFilter = (type: string, keyword: string, flag: string) => {
        setVisibleFilterBox(false);
    }

    const handleSortCategory = (category: string) => {
        setSortCategory(category);
        setVisibleSortBox(false);
    }

    const classes = (col: any) => {
        if (col.id === "status") {
            return 'w-[20px]';
        } else if (col.id === 'name') {
            return 'w-[30%]';
        } else {
            return 'w-[180px]';
        }
    };

    const hideOrShowColumn = (type) => {
        const newColumns = [...columns].map((col: any) => {
            if (col.id == type) {
                col.show = !col.show
            }
            return col;
        })
        console.log("newColumns: ", newColumns)
        setColumns(newColumns);
    }

    const renderRows = () => {
        const updatedRows = rowData.map((item: any) => {
            const updatedItem = { ...item };
            [...columns].forEach((col: any) => {
                if (!col.show) {
                    delete updatedItem[col.id]
                }
            })

            return updatedItem;
        })
        return updatedRows.map((row: any) => {
            return <CampaignTableRow key={row.id} row={row} />
        })
    }

    return (
        <div className="z-0 ">
            {/* filter start */}
            <div className='hidden lg:flex lg:justify-between lg:items-center lg:mb-10 lg:mt-4'>
                <div className='flex justify-between items-center'>
                    <div className='flex justify-center items-center relative'>
                        <Image
                            src={'/filter_list_24px.svg'}
                            width={20}
                            height={20}
                            alt=''
                            className={`${visibleFilterBox ? 'text-[#6039DB]' : ''}`}
                        />
                        <button
                            className={`mx-2 text-[14px] ${visibleFilterBox ? 'text-[#6039DB]' : ''}`}
                            onClick={() => setVisibleFilterBox(!visibleFilterBox)}
                        >
                            Filter
                        </button>
                        <FilterBox visible={visibleFilterBox} filterFunc={handleFilter} />
                    </div>
                    <div className='flex justify-center items-center relative border-l-[1.8px] border-gray-800 pl-2'>
                        <Image
                            src={'/sort_24px.svg'}
                            width={20}
                            height={20}
                            alt=''
                        />
                        <button
                            className={`ml-2 text-[14px] ${visibleSortBox ? 'text-[#6039DB]' : ''}`}
                            onClick={() => setVisibleSortBox(!visibleSortBox)}
                        >
                            Sort
                        </button>
                        <SortBox visible={visibleSortBox} setSortCategory={handleSortCategory} />
                    </div>
                    <div className='ml-8'>
                        <SearchBar />
                    </div>
                </div>
            </div>
            {/* filter end */}
            {/* table start */}
            <div className="w-full overflow-x-auto relative">
                {/* <div className='fixed right-[20px] top-[155px] lg:right-[70px] lg:top-[265px]'>
                    <button
                        onClick={() => { setVisibleViewOptions(!visibleViewOptions) }}
                    >
                        <Image
                            src={'/options.svg'}
                            width={5}
                            height={5}
                            alt=""
                        />
                    </button>
                    <ViewOptions columns={columns} visible={visibleViewOptions} hideOrShowColumn={hideOrShowColumn} />
                </div> */}
                <table className="table-auto min-w-[1000px] text-left sm:w-full md:w-full lg:w-full">
                    <thead>
                        <tr>
                            {columns.filter((col: any) => col.show).map((col: any) => {
                                return (
                                    <th
                                        key={col.id}
                                        className={`border-gray-300 border-b-2 text-md lg:border-b-4 px-4 py-2 lg:text-lg ${classes(col)}`}
                                    >
                                        {col.label}
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody className="font-medium">
                        {
                            renderRows()
                        }
                    </tbody>
                </table>
            </div>
            {/* table end */}
        </div>
    )
}