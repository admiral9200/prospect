import { useEffect, useState } from "react";

interface ContactCheckBoxProps {
    id: any,
    visible: boolean,
    checked: boolean,
    handleContactCheckBox: any
}

const ContactCheckBox = ({ id, visible, checked, handleContactCheckBox }: ContactCheckBoxProps) => {
    const [isChecked, setIsChecked] = useState<boolean>(false);

    const handleHidden = () => {
        if(checked) {
            return '';
        }

        if(visible) {
            return '';
        }

        else {
            return 'hidden';
        }
    }

    const controlHandleBox = (event: any) => {
        setIsChecked(!isChecked);
        handleContactCheckBox(isChecked, id);
    }

    useEffect(() => {
        setIsChecked(checked);
        console.log("changed: ", checked, isChecked)
    }, [checked])

    return (
        <div>
            <input
                id="comments"
                aria-describedby="comments-description"
                name="comments"
                type="checkbox"
                className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 ${ handleHidden() }`}
                onChange={e => controlHandleBox(e)}
                checked={isChecked}
            />
        </div>
    )
}

export default ContactCheckBox;