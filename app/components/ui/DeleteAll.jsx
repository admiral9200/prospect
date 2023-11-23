import { CheckCircleIcon, MinusCircleIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import Spinner from '@/app/components/ui/spinner';


const DeleteAll = ({ campaignId, handleMultiSelect, handleUpdate, isExport, campaign }) => {
    const { foundUrls, processedUrls, multiSelect, readyProfiles, errMsgUrls, errWaitingConnectionUrls, waitingConnectionUrls } = campaign
    const supabase = useSupabaseClient();
    const [isDeleting, setIsDeleting] = useState(false);
    const [deSelect, setDeSelect] = useState(false)


    const handleDeleteALl = async () => {
        if (isDeleting) return;
        setIsDeleting(true);
        // console.log(url);
        try {
            let { data: campaigns, error } = await supabase
                .from(isExport ? 'csv_campaigns' : 'campaigns')
                .select('*')
                .eq('campaign_id', campaignId);

            if (error) {
                console.log('Error fetching campaign data:', error);
                return;
            }

            let filteredNormalizedUrls = []

            if (campaigns && campaigns.length > 0) {
                filteredNormalizedUrls = campaigns[0].linkedin_profiles_url.filter(u => !multiSelect.includes(u))
            }

            const { error: storeError } = await supabase
                .from(isExport ? 'csv_campaigns' : 'campaigns')
                .update({
                    linkedin_profiles_url: filteredNormalizedUrls  // updated here
                })
                .eq('campaign_id', campaignId);

            if (storeError) {
                console.log('Error fetching campaign data:', error);
                return;
            }
            handleMultiSelect((prev) => prev.filter(u => !multiSelect.includes(u)))
            handleUpdate((preVal) => !preVal)
            setIsDeleting(false);

        } catch (error) {
            console.log(error);
        }

    }

    const handleSelectAll = () => {
        // console.log(multiSelect.length);
        const urls = foundUrls.filter(url => {
            return !errMsgUrls?.find(profile => profile.url === url) &&
                !errWaitingConnectionUrls?.find(profile => profile.url === url) &&
                !processedUrls?.find(profile => profile.url === url) &&
                !waitingConnectionUrls?.find(profile => profile.url === url) &&
                !readyProfiles?.find(profile => profile.url === url) &&
                !multiSelect.includes(url)
        })
        // console.log(urls.length);

        handleMultiSelect((prev) => [...prev, ...urls])
        setDeSelect(true)
    }

    const handleDeSelectAll = () => {
        handleMultiSelect([])
        setDeSelect(false)
    }
    return (
        <div className='flex items-center justify-between mt-2 mb-3 overflow-auto'>
            {deSelect ?
                <div
                    onClick={handleDeSelectAll}
                    className={`shrink-0 px-3 pr-3 py-1 bg-green-100 flex items-center space-x-2 rounded-2xl cursor-pointer w-40`}
                >
                    <MinusCircleIcon className={`h-5 w-5 text-green-500`} />
                    <p>De-Select All</p>
                </div> :
                <div
                    onClick={handleSelectAll}
                    className={`shrink-0 px-3 pr-3 py-1 bg-red-100 flex items-center space-x-2 rounded-2xl cursor-pointer w-32`}
                >
                    <CheckCircleIcon className={`h-5 w-5 text-red-500`} />
                    <p>Select All</p>
                </div>
            }
            <div className='px-2 py-2 bg-red-200 rounded-2xl cursor-pointer' onClick={handleDeleteALl}>
                {
                    isDeleting ?
                        (<Spinner size={21} message={undefined} color={'#e53e3e'} />) :
                        (<TrashIcon className={`h-5 w-5 text-red-600`} />)
                }
            </div>
        </div>
    );
};

export default DeleteAll