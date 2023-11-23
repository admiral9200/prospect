import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import ContactRow from './ContactRow';
import ContactStatus from './ContactStatus';
import ContactName from './ConatctName';
import ContactCheckBox from './ContactCheckBox';
import SortBox from './SortBox';
import SearchBar from './SearchBar';
import FilterBox from './FilterBox';
import ContactModal from './ContactModal';
import OptionButton from './OptionButton';
import ViewOptions from './ViewOptions';


interface ContactTableProps {
    isMobile: boolean
}

const ContactTable = ({ isMobile }: ContactTableProps) => {
    const handleContactCheckBox = (isChecked, id) => {
        console.log("is Checked: ", isChecked, id);

        const newRows = [...rows].map(item => {
            if (item.id === id) {
                const newChecked = React.cloneElement(item.checked, { checked: !item.checked.props.checked });
                return { ...item, checked: newChecked };
            } else {
                return item;
            }
        });

        setRows(newRows);
    }

    const items = [
        { id: 1,  name: <ContactName name='John Doe' imageUrl='/avatar-17.png' />, email: 'johndoe@example.com', phone: '02226398889', last_interaction: '5 hrs ago', title: 'Meeting', status: <ContactStatus isContacted="contacted" />, company: 'Bmazon' },
        { id: 2,  name: <ContactName name='Maxim' imageUrl='/avatar-17.png' />, email: 'Maxim@example.com', phone: '07926578831', last_interaction: '1 hrs ago', title: 'Interview', status: <ContactStatus isContacted="contacted" />, company: 'Amazon' },
        { id: 3,  name: <ContactName name='Khalid' imageUrl='/avatar-17.png' />, email: 'Khalid@example.com', phone: '02228446759', last_interaction: '4 hrs ago', title: 'Playing Football', status: <ContactStatus isContacted="contacted" />, company: 'Cmazon' },
        { id: 4,  name: <ContactName name='Chayya' imageUrl='/avatar-17.png' />, email: 'Chayya@example.com', phone: '26542456', last_interaction: '10 hrs ago', title: 'Lunch', status: <ContactStatus isContacted="not_contacted" />, company: 'Dmazon' },
        { id: 5,  name: <ContactName name='Morikawa' imageUrl='/avatar-17.png' />, email: 'Morikawa@example.com', phone: '1234567890', last_interaction: '23 hrs ago', title: 'Dinner', status: <ContactStatus isContacted="contacted" />, company: 'Pmazon' },
        { id: 6,  name: <ContactName name='Matteo' imageUrl='/avatar-17.png' />, email: 'Matteo@example.com', phone: '02652398322', last_interaction: '2 hrs ago', title: 'Go for a walk', status: <ContactStatus isContacted="pending" />, company: 'Soon' },
        { id: 7,  name: <ContactName name='Ono Sabro' imageUrl='/avatar-17.png' />, email: 'OnoSabro@example.com', phone: '01126412092', last_interaction: '7 hrs ago', title: 'Video Game', status: <ContactStatus isContacted="contacted" />, company: 'Panda' },
        { id: 8,  name: <ContactName name='Kall' imageUrl='/avatar-17.png' />, email: 'Kall@example.com', phone: '951284347084', last_interaction: '9 hrs ago', title: 'Breakfast', status: <ContactStatus isContacted="not_contacted" />, company: 'Toyoda' },
        { id: 9,  name: <ContactName name='Gulzar' imageUrl='/avatar-17.png' />, email: 'Gulzar@example.com', phone: '02223090294', last_interaction: '3 hrs ago', title: 'Love', status: <ContactStatus isContacted="contacted" />, company: 'Kmazon' },
        { id: 10,  name: <ContactName name='Shingen' imageUrl='/avatar-17.png' />, email: 'Shingen@example.com', phone: '02224922486', last_interaction: '11 hrs ago', title: 'Entertainment', status: <ContactStatus isContacted="pending" />, company: 'Hmazon' },
    ]

    const [rows, setRows] = useState(items);
    const [visibleSortBox, setVisibleSortBox] = useState<boolean>(false);
    const [visibleFilterBox, setVisibleFilterBox] = useState<boolean>(false);
    const [visibleViewOptions, setVisibleViewOptions] = useState<boolean>(false);
    const [hoveredRow, setHoveredRow] = useState<number>(0);
    const [isSelectedAll, setIsSelectedAll] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const [columns, setColumns] = useState([
        { id: 'name', label: 'Name', show: true },
        { id: 'email', label: 'Email', show: true },
        { id: 'phone', label: 'Phone Number', show: true },
        { id: 'last_interaction', label: 'Last Interaction', show: true },
        { id: 'title', label: 'Title', show: true },
        { id: 'status', label: 'Status', show: true },
        { id: 'company', label: 'Company', show: true }
    ]);


    // For sort, filter...
    const [sortCategory, setSortCategory] = useState<string>('');

    const handleSortCategory = (category: string) => {
        setSortCategory(category);
        setVisibleSortBox(false);
    }

    /**
     * @desc This is used to filter by a 'start with' flag...
     * @param type 
     * @param keyword 
     * @returns 
     */
    const filterByStartsWith = (type: string, keyword: string) => {
        if (type == "name") {
            return [...items].filter((item: any) => {
                const regex = new RegExp(`^${keyword}`, 'i');
                return regex.test(item.name.props.name);
            })
        }

        if (type == "email") {
            return [...items].filter((item: any) => {
                const regex = new RegExp(`^${keyword}`, 'i');
                return regex.test(item.email);
            })
        }

        if (type == "phone") {
            return [...items].filter((item: any) => {
                const regex = new RegExp(`^${keyword}`, 'i');
                return regex.test(item.phone);
            })
        }

        if (type == "title") {
            return [...items].filter((item: any) => {
                const regex = new RegExp(`^${keyword}`, 'i');
                return regex.test(item.title);
            })
        }

        if (type == "company") {
            return [...items].filter((item: any) => {
                const regex = new RegExp(`^${keyword}`, 'i');
                return regex.test(item.company);
            })
        }
    }

    /**
     * 
     * @param type 
     * @param keyword 
     * @returns 
     */
    const filterByContains = (type: string, keyword: string) => {
        if (type == "name") {
            return [...items].filter((item: any) => {
                const regex = new RegExp(`${keyword}`, 'i');
                return regex.test(item.name.props.name);
            })
        }

        if (type == "email") {
            return [...items].filter((item: any) => {
                const regex = new RegExp(`${keyword}`, 'i');
                return regex.test(item.email);
            })
        }

        if (type == "phone") {
            return [...items].filter((item: any) => {
                const regex = new RegExp(`${keyword}`, 'i');
                return regex.test(item.phone);
            })
        }

        if (type == "title") {
            return [...items].filter((item: any) => {
                const regex = new RegExp(`${keyword}`, 'i');
                return regex.test(item.title);
            })
        }

        if (type == "company") {
            return [...items].filter((item: any) => {
                const regex = new RegExp(`${keyword}`, 'i');
                return regex.test(item.company);
            })
        }
    }

    /**
     * 
     * @param type 
     * @param keyword 
     * @returns 
     */
    const filterByDoesNotContain = (type: string, keyword: string) => {
        if (type == "name") {
            return [...items].filter((item: any) => {
                const regex = new RegExp(`${keyword}`, 'i');
                return !regex.test(item.name.props.name);
            })
        }

        if (type == "email") {
            return [...items].filter((item: any) => {
                const regex = new RegExp(`${keyword}`, 'i');
                return !regex.test(item.email);
            })
        }

        if (type == "phone") {
            return [...items].filter((item: any) => {
                const regex = new RegExp(`${keyword}`, 'i');
                return !regex.test(item.phone);
            })
        }

        if (type == "title") {
            return [...items].filter((item: any) => {
                const regex = new RegExp(`${keyword}`, 'i');
                return !regex.test(item.title);
            })
        }

        if (type == "company") {
            return [...items].filter((item: any) => {
                const regex = new RegExp(`${keyword}`, 'i');
                return !regex.test(item.company);
            })
        }
    }

    /**
     * 
     * @param type 
     * @param keyword 
     * @returns 
     */
    const filterByIs = (type: string, keyword: string) => {
        if (type == "name") {
            return [...items].filter((item: any) => {
                return keyword === item.name.props.name;
            })
        }

        if (type == "email") {
            return [...items].filter((item: any) => {
                return keyword === item.email;
            })
        }

        if (type == "phone") {
            return [...items].filter((item: any) => {
                return keyword === item.phone;
            })
        }

        if (type == "title") {
            return [...items].filter((item: any) => {
                return keyword === item.title;
            })
        }

        if (type == "company") {
            return [...items].filter((item: any) => {
                return keyword === item.company;
            })
        }
    }

    /**
     * 
     * @param type 
     * @param keyword 
     * @returns 
     */
    const filterByIsNot = (type: string, keyword: string) => {
        if (type == "name") {
            return [...items].filter((item: any) => {
                return keyword != item.name.props.name;
            })
        }

        if (type == "email") {
            return [...items].filter((item: any) => {
                return keyword != item.email;
            })
        }

        if (type == "phone") {
            return [...items].filter((item: any) => {
                return keyword != item.phone;
            })
        }

        if (type == "title") {
            return [...items].filter((item: any) => {
                return keyword != item.title;
            })
        }

        if (type == "company") {
            return [...items].filter((item: any) => {
                return keyword != item.company;
            })
        }
    }

    /**
     * 
     * @param type 
     * @param keyword 
     * @returns 
     */
    const filterByIsEmpty = (type: string, keyword: string) => {
        if (type == "name") {
            return [...items].filter((item: any) => {
                return (item.name.props.name == "" || !item.name.props.name || item.name.props.name == null)
            })
        }

        if (type == "email") {
            return [...items].filter((item: any) => {
                return (item.email == "" || !item.email || item.email == null)
            })
        }

        if (type == "phone") {
            return [...items].filter((item: any) => {
                return (item.phone == "" || !item.phone || item.phone == null)
            })
        }

        if (type == "title") {
            return [...items].filter((item: any) => {
                return (item.title == "" || !item.title || item.title == null)
            })
        }

        if (type == "company") {
            return [...items].filter((item: any) => {
                return (item.company == "" || !item.company || item.company == null)
            })
        }
    }

    /**
     * 
     * @param type 
     * @param keyword 
     * @returns 
     */
    const filterByIsNotEmpty = (type: string, keyword: string) => {
        if (type == "name") {
            return [...items].filter((item: any) => {
                return item.name.props.name.length > 0;
            })
        }

        if (type == "email") {
            return [...items].filter((item: any) => {
                return item.email.length > 0;
            })
        }

        if (type == "phone") {
            return [...items].filter((item: any) => {
                return item.phone.length > 0;
            })
        }

        if (type == "title") {
            return [...items].filter((item: any) => {
                return item.title.length > 0;
            })
        }

        if (type == "company") {
            return [...items].filter((item: any) => {
                return item.company.length > 0;
            })
        }
    }

    /**
     * @desc This function is used to handle all of the filters.
     * @param type 
     * @param keyword 
     * @param flag 
     */
    const handleFilter = (type: string, keyword: string, flag: string) => {
        let newRows;
        if (keyword == null || keyword == "") {
            setRows([...items]);
        }

        if (flag == "contains") {
            newRows = filterByContains(type, keyword);
            if (newRows) {
                setRows(newRows);
            }
        }

        if (flag == "does not contain") {
            newRows = filterByDoesNotContain(type, keyword);
            if (newRows) {
                setRows(newRows);
            }
        }

        if (flag == "start with") {
            newRows = filterByStartsWith(type, keyword);
            if (newRows) {
                setRows(newRows);
            }
        }

        if (flag == "is") {
            newRows = filterByIs(type, keyword);
            console.log("is: ", newRows);
            if (newRows) {
                setRows(newRows);
            }
        }

        if (flag == "is not") {
            newRows = filterByIsNot(type, keyword);
            if (newRows) {
                setRows(newRows);
            }
        }

        if (flag == "is empty") {
            newRows = filterByIsEmpty(type, keyword);
            if (newRows) {
                setRows(newRows);
            }
        }

        if (flag == "is not empty") {
            newRows = filterByIsNotEmpty(type, keyword);
            if (newRows) {
                setRows(newRows);
            }
        }

        setVisibleFilterBox(false);
    }

    useEffect(() => {
        if (sortCategory == "name") {
            const sortedRows = [...rows].sort((a, b) => {
                const companyA = a.name.props.name.toLowerCase();
                const companyB = b.name.props.name.toLowerCase();

                if (companyA < companyB) {
                    return -1;
                }

                if (companyA > companyB) {
                    return 1;
                }

                return 0;
            });
            setRows(sortedRows);
        }

        if (sortCategory == "company") {
            const sortedRows = [...rows].sort((a, b) => {
                const companyA = a.company.toLowerCase();
                const companyB = b.company.toLowerCase();

                if (companyA < companyB) {
                    return -1;
                }

                if (companyA > companyB) {
                    return 1;
                }

                return 0;
            });
            setRows(sortedRows);
        }

        if (sortCategory == "email") {
            const sortedRows = [...rows].sort((a, b) => {
                const companyA = a.email.toLowerCase();
                const companyB = b.email.toLowerCase();

                if (companyA < companyB) {
                    return -1;
                }

                if (companyA > companyB) {
                    return 1;
                }

                return 0;
            });
            setRows(sortedRows);
        }

        if (sortCategory == "phone") {
            const sortedRows = [...rows].sort((a, b) => {
                const companyA = a.phone.toLowerCase();
                const companyB = b.phone.toLowerCase();

                if (companyA < companyB) {
                    return -1;
                }

                if (companyA > companyB) {
                    return 1;
                }

                return 0;
            });
            setRows(sortedRows);
        }

        if (sortCategory == "last_interaction") {
            const sortedRows = [...rows].sort((a, b) => {
                const companyA = parseInt(a.last_interaction.replace(" hrs ago", ''));
                const companyB = parseInt(b.last_interaction.replace(" hrs ago", ''));

                return companyA - companyB;
            });
            setRows(sortedRows);
        }

        if (sortCategory == "title") {
            const sortedRows = [...rows].sort((a, b) => {
                const companyA = a.title.toLowerCase();
                const companyB = b.title.toLowerCase();

                if (companyA < companyB) {
                    return -1;
                }

                if (companyA > companyB) {
                    return 1;
                }

                return 0;
            });
            setRows(sortedRows);
        }
    }, [sortCategory])

    const handleDragStart = (e, columnId) => {
        e.dataTransfer.setData('text/plain', columnId);
    };

    const handleDragOver = (e, targetColumnId) => {
        e.preventDefault();
        const draggedColumnId = e.dataTransfer.getData('text/plain');
        if (draggedColumnId !== targetColumnId) {
            // Find the indices of dragged and target columns
            const draggedIndex = columns.findIndex((column) => column.id === draggedColumnId);
            const targetIndex = columns.findIndex((column) => column.id === targetColumnId);

            const newRows = rows.map((row) => {
                const newRow = { ...row };
                [newRow[columns[draggedIndex].id], newRow[columns[targetIndex].id]] = [
                    newRow[columns[targetIndex].id],
                    newRow[columns[draggedIndex].id],
                ];
                return newRow;
            });

            const newColumns = columns.map((col) => {
                const newColumn = [...columns];
                if (col.id === draggedColumnId) {
                    return newColumn.filter(col => col.id === targetColumnId)[0]
                } else if (col.id === targetColumnId) {
                    return newColumn.filter(col => col.id === draggedColumnId)[0]
                } else {
                    return col;
                }

            })

            setColumns(newColumns);

        }
    };

    const handleHoverRow = (id: number) => {
        setHoveredRow(id);
    }

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
        const updatedRows = rows.map((item: any) => {
            const updatedItem = { ...item };
            [...columns].forEach((col: any) => {
                if (!col.show) {
                    delete updatedItem[col.id]
                }
            })

            return updatedItem;
        })
        return updatedRows.map((row) => (
            <tr
                key={row.id}
                className={`hover:cursor-pointer hover:bg-gray-200`}
                onMouseEnter={() => handleHoverRow(row.id)}
            >
                {columns.map((column) => (
                    <ContactRow key={`${row.id}-${column.id}`}>{row[column.id]}</ContactRow>
                ))}
            </tr>
        ))
    }

    return (
        <div className='px-4 lg:mt-12'>
            {/* filter start */}
            <div className='flex justify-between items-center mb-10 mt-8' >
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
                    <div className='hidden lg:ml-8'>
                        <SearchBar />
                    </div>
                </div>
            </div>
            {/* filter end */}
            <div className='relative w-full'>

                <div className='relative overflow-x-auto border-t-2 border-gray-300 sm:border-0'>
                    {/* view option start */}
                    <div className='absolute top-4 right-2 md:right-1 lg:right-2'>
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
                    </div>
                    {/* view option end */}
                    <div className='overflow-x-auto'>
                        <table className="w-full text-left scroll-smooth">
                            <thead>
                                <tr>
                                    {columns.filter((col: any) => col.show).map((column) => (
                                        <th
                                            key={column.id}
                                            className="border-gray-300 font-semibold text-black text-[14px] border-b-2 px-4 py-2 cursor-move md:text-sm lg:text-lg"
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, column.id)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => handleDragOver(e, column.id)}
                                        >
                                            {column.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className='font-medium'>
                                {
                                    renderRows()
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="fixed bottom-0 left-0 w-full h-20 bg-gradient-to-t from-transparent to-gray-200 filter blur-lg opacity-75 pointer-events-none"></div>

                </div>
            </div>
        </div>
    );
};
export default ContactTable;