import { VacationFormData } from './schema'

const STORAGE_KEY = 'vacation-requests'

export function saveVacationRequest(data: VacationFormData): void {
  try {
    // Get existing requests
    const existingRequests = getVacationRequests()
    
    // Add new request
    const updatedRequests = [...existingRequests, {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    }]
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests))
    }
  } catch (error) {
    console.error('Error saving vacation request:', error)
  }
}

export function getVacationRequests(): VacationFormData[] {
  try {
    if (typeof window === 'undefined') {
      return []
    }
    
    const savedRequests = localStorage.getItem(STORAGE_KEY)
    return savedRequests ? JSON.parse(savedRequests) : []
  } catch (error) {
    console.error('Error getting vacation requests:', error)
    return []
  }
}

export function clearVacationRequests(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch (error) {
    console.error('Error clearing vacation requests:', error)
  }
}

