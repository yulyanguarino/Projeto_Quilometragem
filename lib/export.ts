import { Record as RecordType } from '@/types'
import { formatDate } from './utils'

/**
 * Gera CSV de registros
 */
export function generateCSV(records: any[]): string {
  const headers = [
    'ID',
    'Condutor',
    'Placa',
    'Data Saída',
    'Data Chegada',
    'KM Inicial',
    'KM Final',
    'Distância (KM)',
    'Motivo',
    'Observações'
  ]
  
  const rows = records.map(record => [
    record.id,
    record.driverName,
    record.vehicle?.licensePlate || '',
    formatDate(record.departureDate),
    formatDate(record.arrivalDate),
    record.initialKm,
    record.finalKm,
    record.distanceTraveled,
    record.purpose || '',
    record.observations || ''
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  return csvContent
}

/**
 * Prepara dados para exportação Excel
 */
export function prepareExcelData(records: any[]): any[][] {
  const headers = [
    'ID',
    'Condutor',
    'Placa',
    'Data Saída',
    'Data Chegada',
    'KM Inicial',
    'KM Final',
    'Distância (KM)',
    'Motivo',
    'Observações'
  ]
  
  const rows = records.map(record => [
    record.id,
    record.driverName,
    record.vehicle?.licensePlate || '',
    formatDate(record.departureDate),
    formatDate(record.arrivalDate),
    record.initialKm,
    record.finalKm,
    record.distanceTraveled,
    record.purpose || '',
    record.observations || ''
  ])
  
  return [headers, ...rows]
}

/**
 * Prepara dados para exportação PDF
 */
export function preparePDFData(records: any[]): any[] {
  return records.map(record => ({
    id: record.id.substring(0, 8),
    driverName: record.driverName,
    licensePlate: record.vehicle?.licensePlate || '',
    departureDate: formatDate(record.departureDate),
    arrivalDate: formatDate(record.arrivalDate),
    initialKm: record.initialKm,
    finalKm: record.finalKm,
    distanceTraveled: record.distanceTraveled,
    purpose: record.purpose || '-',
  }))
}
