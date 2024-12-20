import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function getVacationRequests() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vacation-requests`, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to fetch vacation requests')
  }
  return res.json()
}

export default async function ViewVacationRequests() {
  const requests = await getVacationRequests()

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Solicitações de Férias Cadastradas</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p>Nenhuma solicitação de férias cadastrada.</p>
        ) : (
          requests.map((request: any) => (
            <div key={request.id} className="mb-4 p-4 border rounded-md">
              <p><strong>Nome:</strong> {request.name}</p>
              <p><strong>ID do Funcionário:</strong> {request.employeeId}</p>
              <p><strong>Períodos de Férias:</strong></p>
              <ul className="list-disc pl-5">
                {request.vacationPeriods.map((period: any) => (
                  <li key={period.id}>
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

