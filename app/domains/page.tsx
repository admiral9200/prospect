"use client";

import {useEffect, useState} from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import Navbar from "@/app/components/ui/navbar";

// This is a warpper component that acts as the start of the flow.
// It checks if the user has entered any domain for verification.
// If yes, it shows domain list
// If no, it shows add domain.
// The db will have a domains column under users table that is an array of objects of this nature:

/*

{
  id
  name of domain,
  date of creation,
  dns_records: {
    dkim,
    canme
  }
  status: verified | pending
  associated_emails: [ all emails associated with this domain]
  analytics: Whatever analytics we can fet from sendgrid docs to show the user

}

*/


export default function Domains() {

  // Fetch all domains and check if a user has at least one domain to determine their next page.
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(
    () => {
        const hasUserCreatedAnyDomain = async () => {
          /* this workspace id will come from either of two places:
          1. Under users table
          2. Passed down as a param from navigation
          */
          const workspaceId = "19a686e9-c991-4905-9900-2476a62a8e65"
          const {data, error} = await supabase.from('workspace').select('domains').eq('id', workspaceId)

          if(!error) {
              const domains = data[0].domains;
              if(!domains) {
                router.push('/add-domain')
              } else {
                router.push('/domain-list')
              }
          } else {
            // redirect to app-retry page. Handle this in v1.X.
          }
        }

        if(user) {
          hasUserCreatedAnyDomain()
        }
    }, [user])

  return <div className="w-full">
          {/* {notification as JSX.Element} */}
          <Navbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            modalOpen={undefined}
            step={undefined}
          />
        </div>
}
