
import { z } from 'zod'

/**
 * Schema de validação para criação de registro
 */
export const recordCreateSchema = z.object({
  vehicleId: z.string().min(1, 'Veículo é obrigatório'),
  driverName: z.string().min(2, 'Nome do condutor deve ter no mínimo 2 caracteres'),
  departureDate: z.string().min(1, 'Data de saída é obrigatória'),
  arrivalDate: z.string().min(1, 'Data de chegada é obrigatória'),
  initialKm: z.number().min(0, 'KM inicial deve ser maior ou igual a 0'),
  finalKm: z.number().min(0, 'KM final deve ser maior ou igual a 0'),
  purpose: z.string().optional(),
  observations: z.string().optional(),
})

/**
 * Schema de validação para atualização de registro
 */
export const recordUpdateSchema = z.object({
  driverName: z.string().min(2).optional(),
  departureDate: z.string().optional(),
  arrivalDate: z.string().optional(),
  initialKm: z.number().min(0).optional(),
  finalKm: z.number().min(0).optional(),
  purpose: z.string().optional(),
  observations: z.string().optional(),
})

/**
 * Schema de validação para login
 */
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

/**
 * Schema de validação para registro de usuário
 */
export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

/**
 * Valida se KM final é maior que KM inicial
 */
export function validateKilometers(initialKm: number, finalKm: number): { valid: boolean; error?: string } {
  if (finalKm < initialKm) {
    return { valid: false, error: 'KM final deve ser maior que KM inicial' }
  }
  return { valid: true }
}
