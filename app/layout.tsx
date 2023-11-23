import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Session } from '@supabase/auth-helpers-react'
import Analytics from './Analytics'
import { Suspense } from 'react'
import ContextProvider from '@/app/context/context'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Prosp',
  description: 'Book meetings automatically with AI',
}

export default function RootLayout({
  children,
  initialSession,
}: {
  children: React.ReactNode,
  initialSession: Session,
}) {
  return (
    <html lang="en" className='h-full bg-white'>
      <body className={inter.className}>
        <ContextProvider>

          <Suspense>
            <Analytics />
            <Providers initialSession={initialSession}>
              {children}
            </Providers>
          </Suspense>

        </ContextProvider>
      </body>
    </html>
  )
}