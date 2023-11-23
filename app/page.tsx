'use client'

import { NextPage } from 'next';
import Head from 'next/head';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Faqs } from '@/app/components/landing/Faqs';
import { Footer } from '@/app/components/landing/Footer';
import { Header } from '@/app/components/landing/Header';
import NewHero from '@/app/components/landing/NewHero';
import ProductDemo from '@/app/components/landing/ProductDemo';
import RealWorldExamples from '@/app/components/landing/RealWorldExamples';
import { useSession, useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import NewPricing from '@/app/components/landing/NewPricing';
import LiveTest from '@/app/components/landing/LiveTest';
import useLangParam from '@/app/hooks/useLangParam';
import { v4 as uuidv4 } from 'uuid';

const Home: NextPage = () => {
  const lang = useLangParam()

  const session = useSession();
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser()

  useEffect(() => {
    if (session) {
      router.push(`${lang}/dashboard`);
    }
  }, [session, router, user]);

  return (
    <div className='bg-gray-100 overflow-hidden'>
      <Head>
        <title>Props - AI Sales Outreach</title>
        <meta
          name="description"
          content="Build relationships at scale with AI personnalized outreach and LinkedIn"
        />
      </Head>
      <Header />
      <main>
        <NewHero />
        <LiveTest />
        {/*  <Testimonials />*/}
        <RealWorldExamples />
        <ProductDemo />
        {/* 
        <Features 
/>*/}

        <NewPricing />

        {/*    <PrimaryFeatures />
 <SecondaryFeatures /> <CallToAction /> 
 <Reviews />  


<Steps /> */}
        <Faqs />
      </main>
      <Footer />

    </div>
  );
};

export default Home;
