/**
 * @desc stepbar
 * @param param0 
 * @returns 
 */
export default function StepBar({ step }) {
    return (
        <div>
            <div>
                <p className='ml-2 text-[12px] mb-2'>Step {step} of 3</p>
            </div>
            <div className='flex justify-start mb-6'>
                <div className={`bg-blue-100 w-[40px] h-[2px] mx-[2px] rounded-sm ${(step == 1 || step == 2 || step == 3) ? 'bg-blue-600' : ''}`}></div>
                <div className={`bg-blue-100 w-[40px] h-[2px] mx-[2px] rounded-sm ${(step == 2 || step == 3) ? 'bg-blue-600' : ''}`}></div>
                <div className={`bg-blue-100 w-[40px] h-[2px] mx-[2px] rounded-sm ${(step == 3) ? 'bg-blue-600' : ''}`}></div>
            </div>
        </div>
    )
}
