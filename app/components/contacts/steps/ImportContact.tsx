import Image from "next/image"

export default function ImportContact({ setStep }) {
    return (
        <div className=' flex flex-col items-center w-full translate-y-[60px]'>
            <div className='relative min-h-screen'>
                <Image
                    src={"/contacts_first.svg"}
                    width={600}
                    height={600}
                    alt=''
                />
                <div className='flex flex-col items-center absolute left-0 right-0  mx-auto bottom-[320px] sm:bottom-[160px] md:bottom-[200px] lg:bottom-[360px]'>
                    <p className='font-bold text-[24px]'>All Done !</p>
                    <p className='mt-3 mb-10 opacity-90'>Hi Bhavya, you can start importing contacts</p>
                    <button
                        type="button"
                        className="rounded-xl bg-[#6039DB] px-12 py-4 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => setStep(2)}
                    >
                        Import Contacts
                    </button>
                </div>
            </div>

        </div>
    )
}