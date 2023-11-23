
import Image from 'next/image';

const CheckBox = ({ status, imageUrl, isChecked, handleMultiSelect }) => {
    const pending = status === 'Queue'

    return <div className="text-left" onClick={() => {
        pending ? handleMultiSelect() : null
    }} >
        {(pending && isChecked) ? <input
            type="checkbox"
            defaultChecked
            className="text-red-600 w-10 h-10 rounded-full focus:ring-0 focus:ring-offset-0 transition-transform duration-300 transform scale-100 hover:scale-105 checked:scale-105 cursor-pointer"
        />
            :
            <Image
                loader={() => imageUrl}
                src={imageUrl}
                alt="Avatar"
                width={40}
                height={40}
                className={`rounded-full ${!pending && "cursor-default"}`}
            />
        }
    </div>
}

export default CheckBox