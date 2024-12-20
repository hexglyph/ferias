import { VacationFormData } from './schema'
import prisma from './prisma'

export async function saveVacationRequest(data: VacationFormData) {
  const result = await prisma.vacationRequest.create({
    data: {
      name: data.name,
      employeeId: data.employeeId,
      sellOneThird: data.sellOneThird,
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

