import React, { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { ModuleProps } from './moduleProps';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Mark, mergeAttributes } from '@tiptap/core';
import suggestion from '../suggestion'
import '../styles.scss'
import Mention from '@tiptap/extension-mention'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl';
import useExport from '@/app/hooks/useExport';


// console.log(suggestion)
const PromptModule: React.FC<ModuleProps> = ({ module, isOpen, onToggle, campaignId }) => {
  const t = useTranslations('common')
  const [username, setUsername] = useState('');
  const [isUsernameNotEmpty, setIsUsernameNotEmpty] = useState(false);
  const [isCampaignPromptNotEmpty, setIsCampaignPromptNotEmpty] = useState(false);
  const [campaignPrompt, setCampaignPrompt] = useState("");
  const [promptChanged, setPromptChanged] = useState(false);

  const supabase = useSupabaseClient()
  const isExport = useExport()



  const fetchCampaignData = async () => {
    let { data: campaigns, error } = await supabase
      .from(isExport ? 'csv_campaigns' : 'campaigns')
      .select('*')
      .eq('campaign_id', campaignId);

    if (error) {
      console.log('Error fetching campaign data:', error);
      return;
    }

    if (campaigns && campaigns.length > 0) {
      console.log('alright then', campaigns[0].prompt)
      setCampaignPrompt(campaigns[0].prompt);
      setUsername(campaigns[0].username ? campaigns[0].username : '');
      console.log(campaignPrompt)

      // New lines to set state based on data fetched from database
      setIsUsernameNotEmpty(campaigns[0].username ? true : false);
      setIsCampaignPromptNotEmpty(campaigns[0].prompt ? true : false);
      console.log(campaigns[0].username);
      console.log(campaigns[0].prompt);
    }
  };

  useEffect(() => {
    fetchCampaignData();
    console.log("updating prompt...")
  }, []);



  const handleSavePrompt = async () => {
    console.log(campaignPrompt)
    const { data, error } = await supabase
      .from(isExport ? 'csv_campaigns' : 'campaigns')
      .update({ prompt: campaignPrompt })
      .eq('campaign_id', campaignId);

    if (error) {
      console.log('Error updating campaign prompt:', error);
    } else {
      console.log('Campaign prompt updated successfully:', data);
    }

    setPromptChanged(false);
    fetchCampaignData()
  }

  const handleSaveUsername = async () => {
    const { data, error } = await supabase
      .from(isExport ? 'csv_campaigns' : 'campaigns')
      .update({ username: username })
      .eq('campaign_id', campaignId);

    if (error) {
      console.log('Error updating username :', error);
    } else {
      console.log('Username updated successfully:', data);
    }

    fetchCampaignData()
  }







  return (
    <div>
      <style jsx>{`
  mark {
    background-color: blue;
    color: white;
    padding: 0.5em;
    border-radius: 0.25em;
  },
  .content {
    box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
    border: 1px solid #dbdbdb;
    display: block;
    max-width: 100%;
    min-width: 100%;
    padding: 0.625em;
    resize: vertical;
    background-color: white;
    border-radius: 4px;
  }
`}</style>

      <div
        className={`p-4 flex justify-between items-center cursor-pointer h-16 ${isOpen ? 'bg-gray-50' : ''}`}
        onClick={onToggle}
      >
        <div className="flex items-center">
          <div className={`relative h-7 w-7 rounded-full border ${(isCampaignPromptNotEmpty) ? 'border-purple-700' : 'border-gray-400'} mr-2 flex-shrink-0`}>
            {(isCampaignPromptNotEmpty) && <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-purple-700"></span>}
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
        <div className="px-4 py-4">
          <div className="bg-blue-100 text-blue-700 p-4 rounded-md m-1 flex items-start">

            <InformationCircleIcon className="h-6 w-6 mr-2 flex-shrink-0 text-blue-700" />
            <p className='text-sm'>
              {t('prompt_module_info_msg')}
            </p>
          </div>

          <div className="mt-4 relative flex items-center">
            {campaignPrompt.trim() === "" ? (
              <div className="p-5 outline outline-1 outline-gray-300 rounded-md font-sans leading-7"
                style={{ minWidth: '600px !important' }}> {/* Set a minWidth to keep the editor space */}
                {t('prompt_module_enter_prompt')}
              </div>

            ) : (
              <MyEditor campaignPrompt={campaignPrompt} setCampaignPrompt={setCampaignPrompt} setPromptChanged={setPromptChanged} />
            )}


            <button
              className={`absolute right-0 bottom-0 p-2 rounded-md mb-2 mr-2 ${promptChanged ? 'bg-purple-700 text-white' : ' text-gray-400 bg-gray-100 disabled'}`}
              onClick={handleSavePrompt}
              disabled={!promptChanged}
            >
              {t('prompt_module_save')}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default PromptModule;


const MyEditor = ({ campaignPrompt, setCampaignPrompt, setPromptChanged }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion,
      }),
    ],
    content: campaignPrompt.replace(/\n/g, '<br />'),
    editorProps: {
      attributes: {
        class: 'p-5 outline outline-1 outline-gray-300 rounded-md font-sans leading-7 max-h-48 overflow-y-auto w-full',
      },
    },
    onUpdate: ({ editor }) => {
      setCampaignPrompt(editor.getHTML());
      setPromptChanged(true);
    },
  });

  return editor ? <EditorContent editor={editor} className='min-w-full' /> : null;
}