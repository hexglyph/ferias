'use client'

import { useState } from 'react'
import { VacationForm } from '@/components/vacation-form'
import { Menu } from '@/components/menu'
import { Toaster } from 'react-hot-toast'
import dynamic from 'next/dynamic'

const ViewVacationRequests = dynamic(() => import('./view-requests/page'), { ssr: false })

export default function Page() {
  const [currentOption, setCurrentOption] = useState<'register' | 'view'>('register')

  return (
    <>
      <Toaster position="top-right" />
      <Menu onSelectOption={setCurrentOption} currentOption={currentOption} />
      {currentOption === 'register' ? (
        <VacationForm />
      ) : (
        <ViewVacationRequests />
      )}
    </>
  )
}

