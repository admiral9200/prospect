import Image from 'next/image'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const CustomDatePicker = ({ selectedDate, onChange }) => {
    return (
        <div className='w-full relative'>
            <DatePicker
                selected={selectedDate}
                onChange={onChange}
                dateFormat="dd/MM/yyyy" 
                placeholderText="Select date"
                className="bg-white w-full border border-gray-300 rounded-md py-2 text-[14px] focus:outline-none focus:border-blue-500"
            />
            <div className='absolute top-1 right-2'>
                <Image 
                    src={'/Calendar.svg'}
                    width={30}
                    height={30}
                    alt=''
                />
            </div>
        </div>
    )
}

export default CustomDatePicker