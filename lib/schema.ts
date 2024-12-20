import { z } from 'zod'

const isWeekday = (date: Date) => {
  const day = date.getDay()
  return day >= 1 && day <= 4 // Monday to Thursday
}

const isAtLeast30DaysAhead = (date: Date) => {
  const today = new Date()
  const thirtyDaysFromNow = new Date(today.setDate(today.getDate() + 30))
  return date >= thirtyDaysFromNow
}

export const vacationFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
    .max(100, { message: 'Nome deve ter no máximo 100 caracteres' }),
  employeeId: z
    .string()
    .min(1, { message: 'ID do funcionário é obrigatório' }),
  vacationPeriods: z.array(
    z.object({
      startDate: z.string()
        .refine(
          (date) => isWeekday(new Date(date)),
          { message: 'A data de início deve ser de segunda a quinta-feira' }
        )
        .refine(
          (date) => isAtLeast30DaysAhead(new Date(date)),
          { message: 'A data de início deve ser pelo menos 30 dias a partir de hoje' }
        ),
      duration: z.number()
        .min(5, { message: 'O período mínimo de férias é de 5 dias' })
        .max(30, { message: 'O período máximo de férias é de 30 dias' }),
    })
  ).refine((periods) => {
    const totalDays = periods.reduce((sum, period) => sum + period.duration, 0)
    return totalDays <= 30
  }, { message: 'O total de dias de férias não pode exceder 30' })
  .refine((periods) => {
    return periods.length <= 3
  }, { message: 'Você pode dividir suas férias em no máximo 3 períodos' })
  .refine((periods) => {
    return periods[0].duration >= 14 || periods.length === 1
  }, { message: 'O primeiro período deve ter pelo menos 14 dias, a menos que seja o único período' }),
  sellOneThird: z.boolean().optional(),
})

export type VacationFormData = z.infer<typeof vacationFormSchema>

