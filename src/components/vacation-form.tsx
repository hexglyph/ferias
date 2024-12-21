'use client'

import * as React from 'react'
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { Check, Plus, Trash } from 'lucide-react'
import { toast } from 'react-hot-toast'
// import { saveVacationRequest } from '@/lib/db'
import { VacationFormData, vacationFormSchema } from '@/lib/schema'

export function VacationForm({ className }: React.ComponentProps<typeof Card>) {
  const [formData, setFormData] = React.useState<VacationFormData>({
    name: '',
    employeeId: '',
    vacationPeriods: [{ startDate: '', duration: 30 }],
    sellOneThird: false,
  })
  const [errors, setErrors] = React.useState<Record<string, string> | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrors(null)

    try {
      const validatedData = vacationFormSchema.parse(formData)
      const response = await fetch('/api/vacation-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit vacation request')
      }

      setIsSuccess(true)
      toast.success('Solicitação de férias enviada com sucesso!')
      resetForm()
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message })
      } else {
        setErrors({ general: 'An unexpected error occurred' })
      }
      toast.error('Erro ao enviar solicitação de férias. Por favor, tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      employeeId: '',
      vacationPeriods: [{ startDate: '', duration: 30 }],
      sellOneThird: false,
    })
    setErrors(null)
    setIsSuccess(false)
  }

  const addVacationPeriod = () => {
    if (formData.vacationPeriods.length < 3) {
      setFormData(prev => ({
        ...prev,
        vacationPeriods: [...prev.vacationPeriods, { startDate: '', duration: 5 }],
      }))
    }
  }

  const removeVacationPeriod = (index: number) => {
    if (formData.vacationPeriods.length > 1) {
      setFormData(prev => ({
        ...prev,
        vacationPeriods: prev.vacationPeriods.filter((_, i) => i !== index),
      }))
    }
  }

  const updateVacationPeriod = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const newPeriods = [...prev.vacationPeriods]
      if (field === 'duration') {
        const numValue = parseInt(value as string, 10)
        newPeriods[index] = { ...newPeriods[index], [field]: isNaN(numValue) ? 0 : numValue }
      } else {
        newPeriods[index] = { ...newPeriods[index], [field]: value }
      }
      return { ...prev, vacationPeriods: newPeriods }
    })
  }

  return (
    <Card className={cn('w-full max-w-2xl', className)}>
      <CardHeader>
        <CardTitle>Cadastro de Férias</CardTitle>
        <CardDescription>
          Preencha o formulário para agendar suas férias.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-6">
          {isSuccess && (
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              <Check className="size-4" />
              Suas férias foram registradas com sucesso.
            </p>
          )}
          <div
            className="group/field grid gap-2"
            data-invalid={!!errors?.name}
          >
            <Label
              htmlFor="name"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Nome <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="João da Silva"
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              disabled={isSubmitting}
              aria-invalid={!!errors?.name}
              aria-errormessage="error-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            {errors?.name && (
              <p id="error-name" className="text-destructive text-sm">
                {errors.name}
              </p>
            )}
          </div>
          <div
            className="group/field grid gap-2"
            data-invalid={!!errors?.employeeId}
          >
            <Label
              htmlFor="employeeId"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              ID do Funcionário <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="employeeId"
              name="employeeId"
              placeholder="12345"
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              disabled={isSubmitting}
              aria-invalid={!!errors?.employeeId}
              aria-errormessage="error-employeeId"
              value={formData.employeeId}
              onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
            />
            {errors?.employeeId && (
              <p id="error-employeeId" className="text-destructive text-sm">
                {errors.employeeId}
              </p>
            )}
          </div>
          {formData.vacationPeriods.map((period, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-md">
              <h3 className="font-semibold">Período de Férias {index + 1}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div
                  className="group/field grid gap-2"
                  data-invalid={!!errors?.[`vacationPeriods.${index}.startDate`]}
                >
                  <Label
                    htmlFor={`startDate-${index}`}
                    className="group-data-[invalid=true]/field:text-destructive"
                  >
                    Data de Início <span aria-hidden="true">*</span>
                  </Label>
                  <Input
                    id={`startDate-${index}`}
                    name={`vacationPeriods[${index}].startDate`}
                    type="date"
                    className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                    disabled={isSubmitting}
                    aria-invalid={!!errors?.[`vacationPeriods.${index}.startDate`]}
                    aria-errormessage={`error-startDate-${index}`}
                    value={period.startDate}
                    onChange={(e) => updateVacationPeriod(index, 'startDate', e.target.value)}
                  />
                  {errors?.[`vacationPeriods.${index}.startDate`] && (
                    <p id={`error-startDate-${index}`} className="text-destructive text-sm">
                      {errors[`vacationPeriods.${index}.startDate`]}
                    </p>
                  )}
                </div>
                <div
                  className="group/field grid gap-2"
                  data-invalid={!!errors?.[`vacationPeriods.${index}.duration`]}
                >
                  <Label
                    htmlFor={`duration-${index}`}
                    className="group-data-[invalid=true]/field:text-destructive"
                  >
                    Duração (dias) <span aria-hidden="true">*</span>
                  </Label>
                  <Input
                    id={`duration-${index}`}
                    name={`vacationPeriods[${index}].duration`}
                    type="number"
                    min="5"
                    max="30"
                    className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                    disabled={isSubmitting}
                    aria-invalid={!!errors?.[`vacationPeriods.${index}.duration`]}
                    aria-errormessage={`error-duration-${index}`}
                    value={period.duration.toString()}
                    onChange={(e) => updateVacationPeriod(index, 'duration', e.target.value)}
                  />
                  {errors?.[`vacationPeriods.${index}.duration`] && (
                    <p id={`error-duration-${index}`} className="text-destructive text-sm">
                      {errors[`vacationPeriods.${index}.duration`]}
                    </p>
                  )}
                </div>
              </div>
              {index > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeVacationPeriod(index)}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Remover Período
                </Button>
              )}
            </div>
          ))}
          {formData.vacationPeriods.length < 3 && (
            <Button
              type="button"
              variant="outline"
              onClick={addVacationPeriod}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Período de Férias
            </Button>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sellOneThird"
              name="sellOneThird"
              checked={formData.sellOneThird}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sellOneThird: checked as boolean }))}
            />
            <Label htmlFor="sellOneThird">Vender 1/3 das férias (apenas para o primeiro período)</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar Solicitação de Férias'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

