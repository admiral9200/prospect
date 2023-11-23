'use client'

import { useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import type { useUser, Session } from '@supabase/auth-helpers-react'
import { DoptProvider } from '@dopt/react';
import Modal, { useModal } from '@dopt/react-modal';
import { useBlock } from '@dopt/react';
import Checklist, { useChecklist, useChecklistItem } from '@dopt/react-checklist';

// Import your dependencies at the top of your file

// The new component where the hooks will be used
const ModalComponent = () => {
  const [block, transition] = useBlock<['modal']>('yann-dine-example-flow.dot-1');
  const modal = useModal('yann-dine-example-flow.strong-files-ring');
  const checklist = useChecklist('yann-dine-example-flow.dry-zebras-notice');
  console.log(checklist)
  const checklistItem = useChecklistItem('yann-dine-example-flow.curly-bushes-help');
  console.log(checklistItem)
  
  return (
    <div className='z-99 fixed bottom-16 left-10'>
<Checklist.Root>
  <Checklist.Header>
    <Checklist.Title>{checklist.title}</Checklist.Title>
    <Checklist.DismissIcon onClick={checklist.dismiss} />
  </Checklist.Header>
  <Checklist.Body>{checklist.body}</Checklist.Body>
  <Checklist.Progress
    value={checklist.count('done')}
    max={checklist.size}
  />
  <Checklist.Items>
    {checklist.items.map((item, i) => (
      <Checklist.Item index={i} key={i}>
        {item.completed ? (
          <Checklist.IconCheck />
        ) : item.skipped ? (
          <Checklist.IconSkip />
        ) : (
          <Checklist.IconCircle />
        )}
        <Checklist.ItemContent>
          <Checklist.ItemTitle disabled={item.done}>
            {item.title}
          </Checklist.ItemTitle>

          <Checklist.ItemBody disabled={item.done}>
            {item.body}
          </Checklist.ItemBody>

          {!item.done && (
            <Checklist.ItemCompleteButton onClick={item.complete}>
              {item.completeLabel}
            </Checklist.ItemCompleteButton>
          )}
        </Checklist.ItemContent>
        {!item.done && <Checklist.ItemSkipIcon onClick={item.skip} />}
      </Checklist.Item>
    ))}
  </Checklist.Items>
</Checklist.Root>
    </div>
  )
}

// Your existing Providers function
export function Providers({ children } : {children: React.ReactNode, initialSession: Session }) {
  const [supabase] = useState(() => createPagesBrowserClient())
  // const user = useUser()
  
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <DoptProvider
        apiKey="blocks-a1a6f58f60bc4f908f6051b0fff2ff61b8e53242d05eb012121f95d2d9192c5b_NjI5"
        userId="yann_dine_example_user"
        flowVersions={{
          // prettier-ignore
          'yann-dine-example-flow': 0,
        }}
      >
       {/* <ModalComponent />  */}
        {children}
      </DoptProvider>
    </SessionContextProvider>
  )
}
