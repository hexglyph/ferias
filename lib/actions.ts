'use server'

import { vacationFormSchema, VacationFormData } from '@/lib/schema'
import { saveVacationRequest } from '@/lib/localStorage'
import { z } from 'zod'

export async function vacationFormAction(
  prevState: any,
  formData: FormData
): Promise<any> {
  const rawData = Object.fromEntries(formData.entries())
  
  // Safely parse vacationPeriods
  let parsedVacationPeriods = [];
  try {
    parsedVacationPeriods = JSON.parse(rawData.vacationPeriods as string || '[]');
  } catch (error) {
    console.error('Error parsing vacationPeriods:', error);
    parsedVacationPeriods = [];
  }

  const defaultValues = {
    name: rawData.name as string,
    employeeId: rawData.employeeId as string,
    vacationPeriods: parsedVacationPeriods,
    sellOneThird: rawData.sellOneThird === 'on',
  }

  try {
    const data = vacationFormSchema.parse(defaultValues)

    // Save the vacation request to localStorage
    saveVacationRequest(data)

    // This simulates a slow response like a form submission.
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log(data)

    return Promise.resolve({
      ...prevState,
      name: '',
      employeeId: '',
      vacationPeriods: [{ startDate: '', duration: 30 }],
      sellOneThird: false,
      success: true,
      errors: null,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Promise.resolve({
        ...prevState,
        success: false,
        errors: Object.fromEntries(
          Object.entries(error.flatten().fieldErrors).map(([key, value]) => [
            key,
            value?.join(', '),
          ])
        ),
      })
    }
    return Promise.resolve({
      ...prevState,
      success: false,
      errors: { general: 'An unexpected error occurred' },
    })
  }
}

