import { useState, useEffect } from "react";
import Image from "next/image";
import CampaignTable from "./CampaignTable";
import useScreenBreakpoint from "@/hook/useScreenBreakpoint";
import SearchBar from "./SearchBar";


export default function MainContent({ step, open, setOpen }) {
    const colData = [
        {
            id: 'status',
            label: 'Status',
            show: true
        },
        {
            id: 'name',
            label: 'Name',
            show: true
        },
        {
            id: 'lead_ended',
            label: 'Leads ended',
            show: true
        },
        {
            id: 'creator',
            label: 'Creator',
            show: true
        },
        {
            id: 'created_at',
            label: 'Created at',
            show: true
        },
        {
            id: 'senders',
            label: 'Senders',
            show: true
        }
    ];

    const rowData = [
        {
            id: 1,
            status: false,
            name: "computer is very expensive",
            lead_ended: '0/0',
            creator: "Colin Guichard",
            created_at: 'One day ago',
            senders: [
                '/avatar-1.png',
                '/avatar-2.png',
                '/avatar-3.png',
                '/avatar-4.png'
            ]
        },
        {
            id: 2,
            status: true,
            name: "My com is broken",
            lead_ended: '0/0',
            creator: "Colin Guichard",
            created_at: 'One day ago',
            senders: [
                '/avatar-1.png',
                '/avatar-2.png',
                '/avatar-3.png',
                '/avatar-4.png'
            ]
        },
        {
            id: 3,
            status: false,
            name: "Campaign Name will be here",
            lead_ended: '0/0',
            creator: "Colin Guichard",
            created_at: 'One day ago',
            senders: [
                '/avatar-1.png',
                '/avatar-2.png',
                '/avatar-3.png',
                '/avatar-4.png'
            ]
        },
        {
            id: 4,
            status: true,
            name: "Campaign Name will be here",
            lead_ended: '0/0',
            creator: "Colin Guichard",
            created_at: 'One day ago',
            senders: [
                '/avatar-1.png',
                '/avatar-2.png',
                '/avatar-3.png',
                '/avatar-4.png'
            ]
        },
        {
            id: 5,
            status: false,
            name: "House is very big",
            lead_ended: '0/0',
            creator: "Colin Guichard",
            created_at: 'One day ago',
            senders: [
                '/avatar-1.png',
                '/avatar-2.png',
                '/avatar-3.png',
                '/avatar-4.png'
            ]
        },
        {
            id: 6,
            status: false,
            name: "Campaign Name will be here",
            lead_ended: '0/0',
            creator: "Colin Guichard",
            created_at: 'One day ago',
            senders: [
                '/avatar-1.png',
                '/avatar-2.png',
                '/avatar-3.png',
                '/avatar-4.png'
            ]
        }
    ]

    const [cols, setCols] = useState<any>(colData);
    const [rows, setRows] = useState<any>(rowData);

    const breakpoint = useScreenBreakpoint();
    const [device, setDevice] = useState<string>('');
    const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
    const [showSearchButton, setShowSearchButton] = useState<boolean>(true);
    const [isFiltered, setIsFiltered] = useState<boolean>(false);

    useEffect(() => {
        setDevice(breakpoint);
    }, [breakpoint])

    useEffect(() => {
        setShowSearchBar(!showSearchButton);
    }, [ showSearchButton ])

    const handleChange = (event: any) => {
        if (event.key == 'Enter') {
            const searchTerm = event.target.value;
            console.log(searchTerm)
            const filteredCampaigns = rowData.filter((row: any) => {
                return (
                    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    row.creator.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });

            const highlightedCampaigns = filteredCampaigns.map((campaign: any) => {
                const highlightedName = highlightKeywords(campaign.name, searchTerm);
                const highlightedCreator = highlightKeywords(campaign.creator, searchTerm);

                return {
                    ...campaign,
                    name: highlightedName,
                    creator: highlightedCreator
                }
            })

            setRows(highlightedCampaigns);
            setIsFiltered(true)
        }
    }

    const highlightKeywords = (text: string, searchTerm: string) => {
        const regex = new RegExp(`(${searchTerm})`, "gi");
        const parts = text.split(regex);
        return parts.map((part, index) => {
            if (index % 2 === 1) {
                return <span key={index} className="text-[#739FFF]">{part}</span>;
            } else {
                return part;
            }
        });
    };

    const handleCloseSearchBar = () => {
        setIsFiltered(false);
        setShowSearchBar(false);
        setRows(rowData);
    }
    
    return (
        <div className="relative w-full">
            <div className="flex justify-between items-center p-0 m-0">
                <h2 className="absolute top-[-78px] pl-4 z-40 font-bold text-[24px] sm:absolute sm:top-[-78px] sm:pl-2 sm:z-40 sm:font-bold sm:text-[24px] md:pl-2 lg:absolute lg:top-4 lg:text-[30px]" style={{ zIndex: 10 }}>Campaigns</h2>
                <button
                    className="rounded-xl fixed top-[650px] left-0 right-0 mx-auto w-[200px] py-3 bg-[#6039DB] lg:inline-block lg:border-[1px] lg:bg-[#ece7fb] lg:rounded-2xl lg:py-4 lg:w-[250px] lg:absolute lg:right-[-1500px] lg:top-4"
                    onClick={() => setOpen(!open)}
                >
                    <div className="flex justify-center items-center">
                        <div className="hidden md:block lg:block">
                            <Image
                                src={'/Plus.svg'}
                                width={30}
                                height={30}
                                alt="font-semibold"
                            />
                        </div>
                        <p className="z-1 text-white sm:text-sm lg:pl-2 lg:text-md lg:font-semibold lg:text-[#6039DB]">
                            Add Campaign
                        </p>
                    </div>
                </button>
            </div>
            <button 
                className={`${(!isFiltered && !showSearchBar) || (showSearchBar && isFiltered) ? '' : 'hidden'} inline-block absolute z-40 top-[-120px] right-0 sm:absolute sm:z-40 sm:top-[-120px] sm:right-0 md:hidden lg:hidden`}
                onClick={() => { setShowSearchButton(!showSearchButton);  }}
            >
                <div className="flex justify-end items-center">
                    <Image
                        src={'/search.svg'}
                        width={15}
                        height={15}
                        alt=""
                    />
                    <p className="pl-2">Search</p>
                </div>
            </button>
            <div className={` ${!showSearchBar ? ' border-t-2 border-gray-300' : ''}  lg:border-t-0`}>
                <div className={`${showSearchBar ? ' border-b-2 border-gray-300 pb-4' : ''}`}>
                    <SearchBar visible={showSearchBar} handleChange={handleChange} filtered={isFiltered} handleCloseSearchBar={handleCloseSearchBar}/>
                </div>
                <div className="w-full pt-[100px]">
                    <CampaignTable colData={cols} rowData={rows}/>
                </div>
            </div>
        </div>
    )
}