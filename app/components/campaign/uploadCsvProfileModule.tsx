import React, { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { ModuleProps } from './moduleProps';
import NegativeNotification from '@/app/components/ui/negativeNotification';
import { PhotoIcon } from '@heroicons/react/24/solid'
import { XMarkIcon } from '@heroicons/react/24/solid'
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useContext } from 'react';
import { CampaignDataContext } from '@/helpers/campaignDataContext';
import useExport from '@/app/hooks/useExport';
import { useTranslations } from 'next-intl';

const UploadCsvProfileModule: React.FC<ModuleProps> = ({ module, isOpen, onToggle, campaignId }) => {
  const t = useTranslations('common')
  const supabase = useSupabaseClient()
  const [inputFiles, setInputFiles] = useState<File[]>([]);
  const [fileValidationPassed, setFileValidationPassed] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showNotificationNoUrl, setShowNotificationNoUrl] = useState(false);
  const [linkedinProfilesExist, setLinkedinProfilesExist] = useState(false); // New state variable
  const context = useContext(CampaignDataContext)!;
  const { fetchCampaignData } = context;
  const isExport = useExport()

  const fetchCampData = async () => {
    let { data: campaigns, error } = await supabase
      .from(isExport ? 'csv_campaigns' : 'campaigns')
      .select('*')
      .eq('campaign_id', campaignId);

    if (error) {
      console.log('Error fetching campaign data:', error);
      return;
    }

    if (campaigns && campaigns.length > 0) {
      // Check if linkedin_profiles_url is not null or undefined
      console.log("linkedin_profiles_url:", campaigns[0].linkedin_profiles_url);
      setLinkedinProfilesExist(campaigns[0].linkedin_profiles_url !== null && campaigns[0].linkedin_profiles_url !== undefined);
      console.log('linkedinProfiles:', linkedinProfilesExist)
    }
  };
  useEffect(() => {
    fetchCampData();
  }, []);



  const updateCampaignsWithURLs = async (linkedInURLs: string[]) => {
    // Fetch the current LinkedIn profile URLs for this campaign
    const { data, error } = await supabase
      .from(isExport ? 'csv_campaigns' : 'campaigns')
      .select('linkedin_profiles_url')
      .eq('campaign_id', campaignId);

    if (error) {
      console.error(error);
      return;
    }

    if (!data || !data[0]) {
      console.error('Invalid data structure');
      return;
    }

    // If linkedin_profiles_url is null, initialize it to an empty array
    const oldLinkedInURLs = Array.isArray(data[0].linkedin_profiles_url) ? data[0].linkedin_profiles_url : [];

    // Filter out the URLs that already exist in the database
    const uniqueLinkedInURLs = linkedInURLs.filter(url => !oldLinkedInURLs.includes(url));

    // Combine the old and new URLs
    const updatedLinkedInURLs = [...oldLinkedInURLs, ...uniqueLinkedInURLs];

    // Update the LinkedIn profile URLs for this campaign
    const { error: updateError } = await supabase
      .from(isExport ? 'csv_campaigns' : 'campaigns')
      .update({ linkedin_profiles_url: updatedLinkedInURLs })
      .eq('campaign_id', campaignId);

    if (updateError) {
      console.error(updateError);
      return;
    }


    if (context) {
      fetchCampaignData();
    }

  }




  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    // Check if files are selected
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['csv', 'xls'];


    if (!allowedExtensions.includes(fileExtension || '')) {
      setShowNotification(true);
      setFileValidationPassed(false);
    } else {
      setFileValidationPassed(true);
    }

    if (allowedExtensions.includes(fileExtension || '')) {
      // Read file
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        if (fileExtension === 'csv') {
          const { data } = Papa.parse(fileContent);
          extractLinkedInURLs(data.flat());
        } else if (fileExtension === 'xls') {
          const workbook = XLSX.read(fileContent, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          extractLinkedInURLs(data.flat());
        }

        setInputFiles(prevFiles => [...prevFiles, file]);
      };
      reader.readAsBinaryString(file);
    }

    fetchCampData()
    // clear the selected file from the input
    event.target.value = '';
  };

  const extractLinkedInURLs = (data: unknown[]) => {
    // First, filter the data to get only the LinkedIn URLs
    const linkedInURLsArray = data.filter((item: unknown) =>
      typeof item === 'string' && item.includes('www.linkedin.com/in/')
    ) as string[];

    // Next, remove any duplicates by converting the array to a Set and then back to an array
    const linkedInURLs = Array.from(new Set(linkedInURLsArray));

    updateCampaignsWithURLs(linkedInURLs);

    if (linkedInURLs.length > 0) {
      console.log(linkedInURLs);
    } else {
      setShowNotificationNoUrl(true);
      setFileValidationPassed(false);
    }
  };



  const deleteFile = (fileToDelete: File) => {
    setInputFiles(inputFiles.filter(file => file !== fileToDelete));
    setFileValidationPassed(false);
  };

  return (
    <div>
      <NegativeNotification
        show={showNotification}
        setShow={setShowNotification}
        message={t('upload_csv_module_negative_only_allowed_msg')}
        messageType={t('upload_csv_module_negative_only_allowed_type')}
      />
      <NegativeNotification
        show={showNotificationNoUrl}
        setShow={setShowNotificationNoUrl}
        message={t('upload_csv_module_negative_no_linkedin_profile_msg')}
        messageType={t('upload_csv_module_negative_no_linkedin_profile_type')}
      />
      <div
        className={`p-4 flex justify-between items-center cursor-pointer h-16 ${isOpen ? 'bg-gray-50' : ''}`}
        onClick={onToggle}
      >
        <div className="flex items-center">
          <div className={`relative h-7 w-7 rounded-full border ${(linkedinProfilesExist) ? 'border-purple-700' : 'border-gray-400'} mr-2 flex-shrink-0`}>
            {(linkedinProfilesExist) && <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-purple-700"></span>}
          </div>
          <div className='ml-2'>
            <h4 className="text-md font-semibold">{module.title}</h4>
            <p className='text-sm sm:flex hidden'>{module.description}</p>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <Transition
        show={isOpen}
        enter="transition duration-200"
        enterFrom="opacity-0 transform scale-95"
        enterTo="opacity-100 transform scale-100"
        leave="transition duration-200"
        leaveFrom="opacity-100 transform scale-100"
        leaveTo="opacity-0 transform scale-95"
      >
        <div className=" mt-5 mx-6 bg-blue-100 text-blue-700 p-4 rounded-md m-1 flex items-start">

          <InformationCircleIcon className="h-6 w-6 mr-2 flex-shrink-0 text-blue-700" />
          <p className='text-sm'>
            {t('upload_csv_module_info_msg')}
          </p>
        </div>
        <div className="px-6 pt-2 pb-6">

          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              {inputFiles.map((file, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-200 p-2 rounded mb-4">
                  <span>{file.name}</span>
                  <XMarkIcon className="h-5 w-5 text-red-500 cursor-pointer" onClick={() => deleteFile(file)} />
                </div>
              ))}
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>{t('upload_csv_module_upload_list_pt1')}</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                </label>
                <p className="pl-1"> {t('upload_csv_module_upload_list_pt2')}</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">{t('upload_csv_module_upload_list_pt3')}</p>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default UploadCsvProfileModule;
