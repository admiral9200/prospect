import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Tab from '@/app/components/Tab'

export default function CampaignNameModal({ onClose, onConfirm, isEdit }) {
  const modules = [
    {
      id: 1,
      title: 'Export Icebreakers',
      description: 'Generate personalized Icebreakers and export them as CSV',
      src: '/csv.png'
    },
    {
      id: 2,
      title: 'Send Icebreakers',
      description: 'Send connection requests and personalized Icebreakers automatically',
      src: '/linkedin.png'
    }
  ]
  const [open, setOpen] = useState(true)
  const [campaignName, setCampaignName] = useState('');
  const [id, setId] = useState(0)

  const closeModal = () => {
    setOpen(false);
    onClose(true);
    setId(0)
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center items-center sm:p-0">

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden ml-0 lg:ml-72 rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:p-6">
                {/* Close button (cross) */}
                <button
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={closeModal}
                >
                  <span className="sr-only focus:outline-none">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <div>
                  {/* <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div> */}
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      {isEdit ? 'Edit' : 'Create'} a campaign
                    </Dialog.Title>
                    {!isEdit && <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Pick the right campaign for your need.
                      </p>
                    </div>}
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <form onSubmit={() => {
                    onClose(id); // Close the modal
                    onConfirm(campaignName, id) // Pass the campaign name to onConfirm
                  }}>
                    <input
                      type="text"
                      placeholder="Campaign Name"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="border border-gray-300 px-4 py-2 rounded-md w-full mb-4"
                    />

                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {isEdit ? 'Edit' : 'Create'} Campaign
                    </button>
                  </form>
                </div>
                {
                  !isEdit && modules.map(m => <Tab
                    key={m.id}
                    title={m.title}
                    description={m.description}
                    src={m.src}
                    isToggled={id === m.id}
                    onToggle={() => setId((prev) => m.id)}
                  />
                  )
                }
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
