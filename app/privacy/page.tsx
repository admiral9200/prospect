'use client'

import Head from 'next/head';
import { useState } from 'react';

import { Faqs } from '@/app/components/landing/Faqs';
import { Footer } from '@/app/components/landing/Footer';
import { Header } from '@/app/components/landing/Header';

export default function PrivacyPolicy() {
    const [activeSection, setActiveSection] = useState<string | null>(null);


  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
};

  return (
    <div className='h-full bg-gray-100 overflow-hidden '> 
      <Head>
        <title>Props - AI Sales Outreach</title>
        <meta
          name="description"
          content="Build relationships at scale with AI personnalized outreach and LinkedIn"
        />
      </Head>
      <Header />
      <main className=' max-w-[1440px] flex flex-col mx-auto'>
      <div className=" px-6 py-10 bg-white rounded-md border border-gray-200 shadow-sm mt-12 mb-12">
      <h1 className="text-4xl font-bold mb-5">Prosp Privacy Policy</h1>
      <p className="text-lg mb-10">
        We are Prosp. We prioritize your privacy and make every effort to protect your data. This policy outlines the types of data we collect and how we use it.
      </p>

      {/* Types of Data We Collect Section */}
      <div onClick={() => toggleSection('data')} className="cursor-pointer">
  <div className="flex justify-between items-center">
    <h2 className={`text-2xl font-semibold ${activeSection === 'data' ? 'text-violet-500' : ''}`}>Types of Data We Collect</h2>
    <button onClick={() => toggleSection('data')} className="flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-500">
        {activeSection === 'data' ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />)}
      </svg>
    </button>
  </div>
  {activeSection === 'data' && (
    <ul className="mt-4 space-y-2 list-disc ml-5">
      <li>Contact Details: We collect basic contact details to communicate with you effectively.</li>
      <li>Usage Data: We gather data on how you interact with Prosp and the AI chatbots we provide.</li>
      <li>Financial Information: For transactions and subscriptions, we collect necessary financial details, nothing sensitive.</li>
      <li>Data that Identifies You: We gather necessary information to verify and manage your Prosp account.</li>
      <li>LinkedIn Session Cookies: With your consent, we use your LinkedIn session cookies to enhance the functionality of Prosp.ai and the Prosp Extension. This helps us provide a more personalized and efficient service.</li>
    </ul>
  )}
</div>


      {/* How We Use Your Data Section */}
      <div onClick={() => toggleSection('usage')} className="mt-10 cursor-pointer">
        <div className="flex justify-between items-center">
          <h2 className={`text-2xl font-semibold ${activeSection === 'usage' ? 'text-violet-500' : ''}`}>How We Use Your Data</h2>
          <button onClick={() => toggleSection('usage')} className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-500">
              {activeSection === 'usage' ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />)}
            </svg>
          </button>
        </div>
        {activeSection === 'usage' && (
          <ul className="mt-4 space-y-2 list-disc ml-5">
            <li>To Operate Prosp: We use your data to maintain, enhance, and provide all features of the service.</li>
            <li>To Improve Prosp: We use the data to understand and analyze usage trends and preferences of our users, to improve Prosp.</li>
            <li>To Provide Customer Support: We use your data to respond to your inquiries and solve any potential issues you might have.</li>
            <li>For Marketing Purposes: We send marketing communications based on your preferences.</li>
          </ul>
        )}
      </div>

      {/* Third Parties Who Process Your Data Section */}
      <div onClick={() => toggleSection('thirdParties')} className="mt-10 cursor-pointer">
        <div className="flex justify-between items-center">
          <h2 className={`text-2xl font-semibold ${activeSection === 'thirdParties' ? 'text-violet-500' : ''}`}>Third Parties Who Process Your Data</h2>
          <button onClick={() => toggleSection('thirdParties')} className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-500">
              {activeSection === 'thirdParties' ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />)}
            </svg>
          </button>
        </div>
        {activeSection === 'thirdParties' && (
          <ul className="mt-4 space-y-2 list-disc ml-5">
            <li>Infrastructure: Vercel, Supabase</li>
            <li>Analytics: Google Analytics</li>
            <li>Communications: Postmark</li>
            <li>Payments: Stripe</li>
          </ul>
        )}
      </div>

      {/* Cookies Section */}
      <div onClick={() => toggleSection('cookies')} className="mt-10 cursor-pointer">
        <div className="flex justify-between items-center">
          <h2 className={`text-2xl font-semibold ${activeSection === 'cookies' ? 'text-violet-500' : ''}`}>Cookies</h2>
          <button onClick={() => toggleSection('cookies')} className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-500">
              {activeSection === 'cookies' ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />)}
            </svg>
          </button>
        </div>
        {activeSection === 'cookies' && (
          <p className="mt-4 text-gray-600">
            We use necessary cookies to run and improve the service. Our third-party service providers may also use cookies.
            You have the ability to disable cookies at your convenience, but doing so might affect your user experience.
          </p>
        )}
      </div>

      {/* GDPR Section */}
      <div onClick={() => toggleSection('gdpr')} className="mt-10 cursor-pointer">
        <div className="flex justify-between items-center">
          <h2 className={`text-2xl font-semibold ${activeSection === 'gdpr' ? 'text-violet-500' : ''}`}>Your GDPR Rights</h2>
          <button onClick={() => toggleSection('gdpr')} className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-500">
              {activeSection === 'gdpr' ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />)}
            </svg>
          </button>
        </div>
        {activeSection === 'gdpr' && (
          <ul className="mt-4 space-y-2 list-disc ml-5">
            <li>The Right to Access: You have the right to access your personal data.</li>
            <li>The Right to Rectification: You can update your data at any time.</li>
            <li>The Right to Erasure: You have the right to request that we delete your data.</li>
            <li>The Right to Restrict Processing: You can request that we limit how we use your data.</li>
            <li>The Right to Data Portability: You can request a copy of the data we have about you.</li>
            <li>The Right to Object: You can object to us processing your data.</li>
          </ul>
        )}
      </div>
    </div>
        <Faqs />
      </main>
      <Footer />

    </div>
  );
};

