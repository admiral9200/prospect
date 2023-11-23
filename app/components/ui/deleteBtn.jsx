import { useState } from 'react';
import Spinner from '@/app/components/ui/spinner';
import { TrashIcon } from '@heroicons/react/24/solid';

const DeleteBtn = ({ deleteUrl, url }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const _delete = async () => {
        if (isDeleting) return;
        setIsDeleting(true);
        await deleteUrl(url);
        setIsDeleting(false);
    };

    return (
        <button onClick={_delete} disabled={isDeleting} >
            <div className={`px-2 py-1 bg-red-100 rounded-2xl`}>
                {isDeleting ? (
                    <Spinner size={21} message={undefined} color={'#e53e3e'} />
                ) : (
                    <TrashIcon
                        className={`h-5 w-5 text-red-600 `}
                    />
                )
                }
            </div >
        </button>
    );
};

export default DeleteBtn;
