'use client'

import AddDomain from "../components/domains/steps/AddDomain";
import Navbar from "@/app/components/ui/navbar";
import { useState } from "react";

export default function CreateDomain() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="">
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          modalOpen={undefined}
          step={undefined}
        />
      </div>
      <div className="min-h-screen w-full relative">
        {!sidebarOpen && <AddDomain />}
      </div>
    </div>
  );
}
