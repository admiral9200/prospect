'use client'

import { useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import type { useUser, Session } from '@supabase/auth-helpers-react'

// Your existing Providers function
export function Providers({ children } : {children: React.ReactNode, initialSession: Session }) {
  const [supabase] = useState(() => createPagesBrowserClient())
  // const user = useUser()
  
  return (
    <SessionContextProvider supabaseClient={supabase}>
       {/* <ModalComponent />  */}
        {children}
    </SessionContextProvider>
  )
}
