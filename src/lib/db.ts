import { VacationFormData } from '@/lib/schema'
import prisma from '@/lib/prisma'

export async function saveVacationRequest(data: VacationFormData) {
  const result = await prisma.vacationRequest.create({
    data: {
      name: data.name,
      employeeId: data.employeeId,
      sellOneThird: data.sellOneThird ?? false,
      vacationPeriods: {
        create: data.vacationPeriods.map(period => ({
          startDate: new Date(period.startDate),
          duration: period.duration
        }))
      }
    }
  })
  
  return result
}

export async function getVacationRequests() {
  const requests = await prisma.vacationRequest.findMany({
    include: {
      vacationPeriods: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  return requests
}

