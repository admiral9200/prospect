'use client'

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/app/components/ui/navbar';
import useNotification from '@/app/components/ui/notification';
import { useLayoutEffect, useRef } from 'react'
import MainContent from '../components/campaigns/MainContent';

type Person = {
    LinkedInFullName: string;
    title: string;
    company: string;
    location: string;
    email: string;
    phone: string;
    employees: string;
    status: string;
};

const people: Person[] = [
    {
        LinkedInFullName: 'Lindsay Walton',
        title: 'Front-end Developer',
        company: 'Front-end Developer',
        location: 'Paris',
        email: 'lindsay.walton@example.com',
        phone: 'Front-end Developer',
        employees: 'Member',
        status: 'Front-end Developer',
    },
    {
        LinkedInFullName: 'Lindsay Walton',
        title: 'Front-end Developer',
        company: 'Front-end Developer',
        location: 'Paris',
        email: 'lindsay.walton@example.com',
        phone: 'Front-end Developer',
        employees: 'Member',
        status: 'Contacted',
    },
    {
        LinkedInFullName: 'Lindsay Walton',
        title: 'Front-end Developer',
        company: 'Front-end Developer',
        location: 'Paris',
        email: 'lindsay.walton@example.com',
        phone: 'Front-end Developer',
        employees: 'Member',
        status: 'Contacted',
    },
    {
        LinkedInFullName: 'Lindsay Walton',
        title: 'Front-end Developer',
        company: 'Front-end Developer',
        location: 'Paris',
        email: 'lindsay.walton@example.com',
        phone: 'Front-end Developer',
        employees: 'Member',
        status: 'Contacted',
    },
    // More people...
]

export default function Campaigns() {

    const checkbox = useRef<HTMLInputElement>(null);
    const [checked, setChecked] = useState(false)
    const [indeterminate, setIndeterminate] = useState(false)
    const [selectedPeople, setSelectedPeople] = useState<Person[]>([]);

    const [step, setStep] = useState<number>(7);

    useLayoutEffect(() => {
        const isIndeterminate = selectedPeople.length > 0 && selectedPeople.length < people.length;
        setChecked(selectedPeople.length === people.length);
        setIndeterminate(isIndeterminate);
        if (checkbox.current) { // Add this check
            checkbox.current.indeterminate = isIndeterminate;
        }
    }, [selectedPeople]);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notification, notify] = useNotification();
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div className='w-full'>
            {notification as JSX.Element}
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} modalOpen={open} step={step} />
            {!sidebarOpen &&
                <main className={`lg:pl-72`}>
                    <section className='px-8'>
                        <MainContent step={step} open={open} setOpen={setOpen} />
                    </section>
                    <div className="px-4 sm:px-6 lg:px-8"></div>
                </main>
            }
        </div>
    );
}