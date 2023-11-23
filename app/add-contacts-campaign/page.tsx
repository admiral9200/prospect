'use client'

import { useEffect, useState } from "react";
import Image from "next/image";

import ToggleStatus from "../components/add-contacts-campaign/ToggleStatus";
import ContactTable from "../components/add-contacts-campaign/ContactTable";
import TopStepBar from "../components/add-contacts-campaign/TopStepBar";
import FromCSV from "../components/add-contacts-campaign/FromCSV";
import FromLinkedIn from "../components/add-contacts-campaign/FromLinkedIn";
import FromLinkedinExtractProfile from "../components/add-contacts-campaign/FromLinkedInExtractProfile";
import FromExistingCampaign from "../components/add-contacts-campaign/FromExistingCampaign";
import ReactFlowBoard from "../components/add-contacts-campaign/reactflow/ReactFlowBoard";
import StartNode from "../components/add-contacts-campaign/reactflow/nodes/FirstNode";
import ConnectionNode from "../components/add-contacts-campaign/reactflow/nodes/ConnectionNode";


// This component is to add contacts to campaign and build sequence using react flow.
// There are 4 types to import contacts - csv, via user's contacts, via linkedin, via existing campaign
// Using React flow, when changing the nodes, the forms on right side must be changed in 'Build sequence' step.



export default function AddContactsCampaign() {
  const [current, setCurrent] = useState<string>("");
  const [currentCampaign, setCurrentCampaign] = useState<string>("");
  const [step, setStep] = useState<number>(4);
  const [filename, setFilename] = useState<string>("");

  // in react flow, to observe the change of item to display form on right side on screen...
  const [action, setAction] = useState<string>("");
  const [condition, setCondition] = useState<string>("");
  const [initialNodes, setInitialNodes] = useState<any>( [
    {
        id: '1',
        type: 'customNodeType',
        data: { label: <StartNode /> },
        position: { x: 250, y: 25 },
    },
    {
        id: '2',
        type: 'customNodeType',
        data: { label: <ConnectionNode open={open} setOpen={setOpen}/> },
        position: { x: 340, y: 125 }
    }
];)

const [initialEdges, setInitialEdges] = useState<any>([
  { id: 'e1-2', source: '1', target: '2', animated: true },
])

  const handleMethodClick = (method: string) => {
    setCurrent(method);
  }

  const handleCurrentCampaign = (campaign: string) => {
    console.log(campaign)
    setCurrentCampaign(campaign);
  }

  const handleFile = (event: any) => {
    const tmpFile = event.target.files[0].name;
    setStep(2);
    setCurrent("csv")
    setFilename(tmpFile);
  }

  useEffect(() => {
    console.log("action: ", action);
    if(action == "SEND_LINKEDIN_CONNECTION_REQUEST") {

    }
  }, [action])

  return (
    <div className='w-full'>
      <main
        className="relative bg-white lg:bg-[#F7F4FF] h-auto min-h-[100vh] lg:bg-repeat lg:bg-[url('/stripe_13.svg')]"
        style={{ backgroundRepeat: 'repeat' }}
      >
        <section className="bg-repeat h-full">
          <div className={`z-10 bg-white w-full flex flex-col justify-center items-center sm:flex-col sm:justify-start sm:items-start md:flex-col md:justify-start md:items-start lg:flex-row lg:justify-between lg:items-center lg:border-b-2 border-gray-200 py-4 lg:py-6 ${(step == 1 || step == 2) ? 'border-b-[1px] border-gray-200' : ''} lg:border-gray-300`}>
            <div className={`w-full flex justify-between items-center ${(step == 1 || step == 2) ? 'border-b-[1px] border-gray-200' : ''} lg:border-0 pb-2 lg:w-[400px] lg:justify-start px-4 lg:pl-4`}>
              <div className="flex items-center justify-center">
                <button onClick={() => setStep(step - 1)}>
                  <Image
                    src={'/arrow_left.svg'}
                    width={20}
                    height={20}
                    alt=""
                  />
                </button>
                {<p className="px-4 font-bold text-[28px]">Campaign Name</p>}
              </div>
              {<ToggleStatus />}
            </div>
            <TopStepBar step={step} />
            <div></div>
          </div>

          {
            // this is the first interface to show 4 blocks to import contacts...
            step == 1 &&
            <div className="flex flex-col w-full justify-start items-start lg:pt-[100px] lg:justify-center lg:items-center">
              <div className="mt-8 pb-4 px-4 text-left lg:text-center lg:pb-10">
                <h2 className="text-[26px] lg:text-[36px] font-bold">Choose a method to import contacts</h2>
                <p className="pt-2">Select one option</p>
              </div>
              <div className="px-4 grid grid-cols-1 w-full pr-12 lg:grid-cols-2 lg:grid-rows-2 lg:w-[700px]">
                <div className="relative w-full mx-4 my-3 flex justify-center">
                  <label
                    htmlFor="file-input"
                    className={`${current == "csv" ? 'border-[#6039DB]' : 'border-[#6039DB] border-opacity-10'} bg-white block rounded-2xl border-[3px] w-full lg:w-[300px] h-[200px] hover:border-[#6039DB] `}>
                    <span className="sr-only">Upload File</span>
                    <input
                      id="file-input"
                      type="file"
                      className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                      onChange={(e) => handleFile(e)}
                    />
                    <div className="absolute top-0 right-0 left-0 bottom-0 m-auto flex flex-col justify-center items-center">
                      <Image
                        src={`${current == "csv" ? '/csv_activate.svg' : '/csv.svg'}`}
                        width={170}
                        height={170}
                        alt=""
                      />
                      <p className="font-bold">Import from CSV</p>
                    </div>
                  </label>
                </div>
                <button
                  className={`${current == "contacts" ? 'border-[#6039DB]' : 'border-[#6039DB] border-opacity-10'} bg-white mx-4 my-3 block rounded-2xl border-[3px]  w-full lg:w-[300px] h-[200px] hover:border-[#6039DB]`}
                  onClick={() => { handleMethodClick("contacts"); setStep(2) }}
                >
                  <div className="flex flex-col justify-center items-center">
                    <Image
                      src={`${current == "contacts" ? 'contacts_activate.svg' : '/contacts_inactivate.svg'}`}
                      width={170}
                      height={170}
                      alt=""
                    />
                    <p className="font-bold">My Contacts</p>
                  </div>
                </button>
                <button
                  className={`${current == "linkedin" ? 'border-[#6039DB]' : 'border-[#6039DB] border-opacity-10'} bg-white mx-4 my-3 block rounded-2xl border-[3px]  w-full lg:w-[300px] h-[200px] hover:border-[#6039DB]`}
                  onClick={() => { handleMethodClick("linkedin"); setStep(2) }}
                >
                  <div className="flex flex-col justify-center items-center">
                    <Image
                      src={`${current == "linkedin" ? '/linkedin_activate.svg' : '/linkedin_icon.svg'}`}
                      width={170}
                      height={170}
                      alt=""
                    />
                    <p className="font-bold">Via Linkedin</p>
                  </div>
                </button>
                <button
                  className={`${current == "campaign" ? 'border-[#6039DB]' : 'border-[#6039DB] border-opacity-10'} bg-white mx-4 my-3 block rounded-2xl border-[3px]  w-full lg:w-[300px] h-[200px] hover:border-[#6039DB]`}
                  onClick={() => { handleMethodClick("campaign"); setStep(2) }}
                >
                  <div className="flex flex-col justify-center items-center">
                    <Image
                      src={`${current == "campaign" ? '/campaign_activate.svg' : '/campaign_icon.svg'}`}
                      width={170}
                      height={170}
                      alt=""
                    />
                    <p className="font-bold">Via Existing Campaign</p>
                  </div>
                </button>
              </div>
            </div>
          }

          {
            // when current is 'csv' and there is file....
            (step == 2 && filename.length > 0 && current == "csv") &&
            <FromCSV filename={filename} />
          }

          {
            // when a user click 'My Contacts' button....
            (step == 2 && current == "contacts") &&
            <div className="px-4">
              <p className="text-[28px] font-bold">Import contacts via my contacts</p>
              <ContactTable />
            </div>
          }

          {
            // When a user clicks the 'Via Linkedin' button....
            (step == 2 && current == "linkedin") &&
            <FromLinkedIn setStep={setStep} />
          }

          {
            // When a user is going to extract profile from linkedin....
            (step == 3 && current == "linkedin") &&
            <FromLinkedinExtractProfile />
          }

          {
            // When a user click 'Via Existing Campaign' button....
            (step == 2 && current == "campaign") &&
            <FromExistingCampaign
              handleCurrentCampaign={handleCurrentCampaign}
              currentCampaign={currentCampaign}
            />
          }

          {
            // building sequence...
            step == 4 &&
            <div className="flex">
              <div className="w-[50%] h-screen">
                <ReactFlowBoard 
                  action={action} 
                  setAction={setAction} 
                  condition={condition} 
                  setCondition={setCondition}
                />
              </div>
              <div className="z-10 bg-white w-[50%] border-l-2 border-gray-200">
                1111
              </div>
            </div>
          }
        </section>
      </main>
    </div>
  );
}