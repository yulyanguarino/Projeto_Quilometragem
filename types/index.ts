
// Tipos globais da aplicação

export interface Record {
  id: string
  vehicleId: string
  userId?: string | null
  driverName: string
  departureDate: Date
  arrivalDate: Date
  initialKm: number
  finalKm: number
  distanceTraveled: number
  purpose?: string | null
  observations?: string | null
  createdAt: Date
  updatedAt: Date
  vehicle?: Vehicle
  user?: User | null
}

export interface Vehicle {
  id: string
  licensePlate: string
  brand?: string | null
  model?: string | null
  year?: number | null
  color?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name?: string | null
  email: string
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface ChangeHistory {
  id: string
  recordId: string
  userId?: string | null
  fieldChanged: string
  previousValue?: string | null
  newValue?: string | null
  changeDate: Date
  user?: User | null
}

export type ExportFormat = 'csv' | 'pdf' | 'excel'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
