import Image from "next/image";
import { useState } from "react";
import CustomDatePicker from "./DatePicker";

interface DateFilterBoxProps {
    visible: boolean,
    type: string,
    filterFunc: any
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const DateFilterBox = ({ visible, type, filterFunc }: DateFilterBoxProps) => {

    const [selectedDate, setSelectedDate] = useState<any>(null)

    const handleDateChange = date => {
        setSelectedDate(date)
    }

    const className = () => {
        if (type == "last_interaction") {
            return 'absolute top-[120px] right-[-220px] z-30 bg-white w-[250px] h-auto shadow-2xl rounded-2xl p-4'
        }
    }

    const items = [
        'is inferior',
        'superior',
        'equal'
    ];

    return (
        <div className={classNames(visible ? className() : 'hidden')}>
            <div className="flex justify-between items-center">
                <div className="flex justify-center items-center">
                    <p>Date is</p>
                    <select className="border-none w-[120px] pl-2 font-bold text-[14px]">
                        {
                            items.map((item: string, index: number) => (
                                <option key={index}>{item}</option>
                            ))
                        }
                    </select>
                </div>
                <Image
                    src={'/rest_icon.svg'}
                    width={20}
                    height={20}
                    alt=""
                />
            </div>
            <div>
                <CustomDatePicker selectedDate={selectedDate} onChange={handleDateChange} />
            </div>
        </div>
    )
}

export default DateFilterBox;