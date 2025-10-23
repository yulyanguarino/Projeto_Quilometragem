
import { type ClassValue, clsx } from 'clsx'

/**
 * Combina classes CSS (útil com Tailwind)
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Formata data para exibição
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Formata número para exibição de quilometragem
 */
export function formatKm(km: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(km) + ' km'
}

/**
 * Calcula distância percorrida
 */
export function calculateDistance(initialKm: number, finalKm: number): number {
  return Math.round((finalKm - initialKm) * 10) / 10
}

/**
 * Gera ID único
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
