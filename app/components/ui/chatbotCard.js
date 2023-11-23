import { useState, Fragment } from "react";
import Link from "next/link";
import { Transition } from "@headlessui/react";
import { LinkedInMark, Logo, Logomark } from "@/app/components/landing/Logo";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import ConfirmDel from "@/app/components/ui/ConfirmDel";
import CampaignNameModal from "../campaign/campaignName";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useParams } from "next/navigation";
import useLangParam from "@/app/hooks/useLangParam";

export default function ChatbotCard({
  botName,
  botIcon,
  campaignIdentifier,
  deleteChatbot,
  deleting,
  isExport,
  setIsUpdate
}) {
  const lang = useLangParam()
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const supabase = useSupabaseClient();

  const handleEditCampaign = async (name, id) => {
    console.log(campaignIdentifier);
    console.log(name);
    const { error: storeError } = await supabase
      .from(isExport ? 'csv_campaigns' : 'campaigns')
      .update({
        campaign_name: name  // updated here
      })
      .eq('campaign_id', campaignIdentifier);

    if (storeError) {
      console.log('Error fetching campaign data:', error);
      return;
    }
    setModalOpen(false)
    setIsUpdate(name)
  };


  return (
    <>
      {modalOpen && (
        <CampaignNameModal onClose={() => setModalOpen(false)} onConfirm={handleEditCampaign} isEdit={true} />
      )}
      <div
        className="group relative cursor-pointer bg-[#FCFCFC] hover:bg-purple-800 hover:text-white"
        style={{
          width: "216px",
          height: "216px",
          border: "1px solid #D1D5DB",
          borderRadius: "16px",
          position: "relative",
          marginTop: "32px",
        }}
      >
        <Link
          className="absolute inset-0 z-10"
          href={`${lang}/${isExport ? 'export-campaign-setup' : 'campaign-setup'}?id=${campaignIdentifier}&step=1`}
        >
          <span className="sr-only">Go to settings for {botName}</span>
        </Link>
        <div
          className="left-2 top-2 flex items-center justify-center"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "100px",
            position: "absolute",
            top: "16.01px",
            left: "16.12px",
          }}
        >
          <LinkedInMark />
        </div>
        <p
          style={{
            fontSize: "16px",
            position: "absolute",
            left: "16.12px",
            bottom: "24.01px",
            lineHeight: "20px",
          }}
        >
          {botName}
        </p>

        <div>
          <div
            className="absolute right-2 bottom-2 mb-2"
            style={{ zIndex: 10 }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(!dropdownOpen);
              }}
              type="button"
              className="group-hover:bg-white inline-flex justify-center rounded-md px-1 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 z-20"
              id="options-menu"
              aria-haspopup="true"
              aria-expanded="true"
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>
          </div>
        </div>


        <Transition
          show={dropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >

          <div className="absolute right-2 bottom-2 mb-10 z-10">

            <div
              className="origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            // style={{ position: "absolute", right: "10px", bottom: "40px" }}
            >
              <div className="py-1" role="none">
                <button
                  onClick={() => {
                    // handleEditCampaignName()
                    setModalOpen(true);
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  Edit Campaign Name
                </button>
                <button
                  onClick={() => {
                    setConfirmDeleteOpen(true);
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <ConfirmDel
        open={confirmDeleteOpen}
        setOpen={setConfirmDeleteOpen}
        chatbotId={campaignIdentifier}
        onDelete={deleteChatbot}
        deleting={deleting}
      />
    </>
  );
}
