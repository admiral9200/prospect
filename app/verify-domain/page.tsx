'use client'
import { useState } from 'react';
import Navbar from '@/app/components/ui/navbar';
import VerifyDomain from '../components/domains/steps/VerifyDomain';


export default function DomainVerify() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
  <div className="w-full">
  {/* {notification as JSX.Element} */}
  <Navbar
    sidebarOpen={sidebarOpen}
    setSidebarOpen={setSidebarOpen}
    modalOpen={undefined}
    step={undefined}
  />
  {!sidebarOpen && (
    <main className={`lg:pl-72`}>
      <section className="px-8">
      <VerifyDomain />
      </section>
      <div className="px-4 sm:px-6 lg:px-8"></div>
    </main>
  )}
</div>

);
}
