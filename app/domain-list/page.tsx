import DomainList from "../components/domains/steps/DomainList";
import Navbar from "@/app/components/ui/navbar";
import { useState } from "react";

export default function ListOfDomains() {
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
          <section className="px-8 pt-16">
            <DomainList />
          </section>
          <div className="px-4 sm:px-6 lg:px-8"></div>
        </main>
      )}
    </div>
  )
}
