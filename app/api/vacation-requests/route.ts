import { NextResponse } from 'next/server'
import { vacationFormSchema } from '@/lib/schema'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = vacationFormSchema.parse(body)
    
    const result = await prisma.vacationRequest.create({
      data: {
        name: validatedData.name,
        employeeId: validatedData.employeeId,
        sellOneThird: validatedData.sellOneThird ?? false,
        vacationPeriods: {
          create: validatedData.vacationPeriods.map(period => ({
            startDate: new Date(period.startDate),
            duration: period.duration
          }))
        }
      }
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in POST /api/vacation-requests:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function GET() {
  try {
    const requests = await prisma.vacationRequest.findMany({
      include: {
        vacationPeriods: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error in GET /api/vacation-requests:', error)
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

