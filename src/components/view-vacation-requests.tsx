'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VacationFormData } from "@/lib/schema"

export function ViewVacationRequests() {
  const [requests, setRequests] = useState<VacationFormData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/vacation-requests')
        if (!res.ok) {
          throw new Error('Failed to fetch vacation requests')
        }
        const data = await res.json()
        setRequests(data)
      } catch (error) {
        console.error('Error fetching vacation requests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  if (loading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Carregando solicitações...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Solicitações de Férias Cadastradas</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p>Nenhuma solicitação de férias cadastrada.</p>
        ) : (
          requests.map((request) => (
            <div key={request.employeeId} className="mb-4 p-4 border rounded-md">
              <p><strong>Nome:</strong> {request.name}</p>
              <p><strong>ID do Funcionário:</strong> {request.employeeId}</p>
              <p><strong>Períodos de Férias:</strong></p>
              <ul className="list-disc pl-5">
                {request.vacationPeriods.map((period, index) => (
                  <li key={index}>
                    Início: {new Date(period.startDate).toLocaleDateString()}, Duração: {period.duration} dias
                  </li>
                ))}
              </ul>
              <p><strong>Vender 1/3 das férias:</strong> {request.sellOneThird ? 'Sim' : 'Não'}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

