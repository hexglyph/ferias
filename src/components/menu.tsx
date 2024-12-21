'use client'

import { Button } from "@/components/ui/button"

interface MenuProps {
  onSelectOption: (option: 'register' | 'view') => void
  currentOption: 'register' | 'view'
}

export function Menu({ onSelectOption, currentOption }: MenuProps) {
  return (
    <div className="flex justify-center space-x-4 mb-6">
      <Button 
        onClick={() => onSelectOption('register')}
        variant={currentOption === 'register' ? 'default' : 'outline'}
      >
        Cadastrar Férias
      </Button>
      <Button 
        onClick={() => onSelectOption('view')}
        variant={currentOption === 'view' ? 'default' : 'outline'}
      >
        Consultar Férias
      </Button>
    </div>
  )
}

