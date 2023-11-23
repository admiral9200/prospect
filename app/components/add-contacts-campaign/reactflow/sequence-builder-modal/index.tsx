import Image from "next/image";
import { useState } from "react";
import ActionsContainer from "./ActionsContainer";
import ConditionsContainer from "./ConditionsContainer";

const Container = ({ setAction, setCondition, setOpen }) => {

    const [current, setCurrent] = useState<string>("action");


    return (
        <div className="p-8">
            <div>
                <button
                    className={`py-2.5 px-2.5 border-[2px] w-[200px] border-gray-300 rounded-l-[10px] ${current == "action" ? ' bg-[#6039DB] text-white' : ''}`}
                    onClick={() => setCurrent("action")}
                >
                    Add an action
                </button>
                <button
                    className={`bg-[#6039DB py-2.5 px-2.5 border-[2px] w-[200px] border-gray-300 rounded-r-[10px] ${current == "condition" ? ' bg-[#6039DB] text-white' : ''}`}
                    onClick={() => setCurrent("condition")}
                >
                    Add a condition
                </button>
            </div>
            <div className="flex justify-center items-center mt-10 mb-4">
                <Image
                    src={'/add-contacts-campaign/ai_star_icon.svg'}
                    width={20}
                    height={20}
                    alt=""
                />
                <p className="pl-2 font-semibold text-gray-600">Create your messages with AI assistant</p>
            </div>

            {
                // when current is 'action'...
                current == 'action' && 
                <ActionsContainer 
                    setOpen={setOpen}
                    setAction={setAction}
                />
            }

            {
                // when current is 'condition'...
                current == 'condition' &&
                <ConditionsContainer 
                    setOpen={setOpen}
                    setCondition={setCondition}
                />
            }
        </div>
    )
}

export default Container;