'use client'

import { useState } from 'react'
import { VacationForm } from '@/components/vacation-form'
import { ViewVacationRequests } from '@/components/view-vacation-requests'
import { Menu } from '@/components/menu'
import { Toaster } from 'react-hot-toast'

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

