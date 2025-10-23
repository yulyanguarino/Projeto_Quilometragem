
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { prepareExcelData } from '@/lib/export'
import * as XLSX from 'xlsx'

/**
 * GET /api/export/excel
 * Exporta registros em formato Excel
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    // Constrói filtros
    const where: any = {}
    
    if (startDate) {
      where.departureDate = {
        ...where.departureDate,
        gte: new Date(startDate)
      }
    }
    
    if (endDate) {
      where.arrivalDate = {
        ...where.arrivalDate,
        lte: new Date(endDate)
      }
    }
    
    // Busca registros
    const records = await prisma.record.findMany({
      where,
      include: {
        vehicle: true,
      },
      orderBy: {
        departureDate: 'desc'
      }
    })
    
    // Prepara dados
    const data = prepareExcelData(records)
    
    // Cria workbook
    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Quilometragem')
    
    // Gera buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    
    // Retorna arquivo
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="quilometragem.xlsx"',
      },
    })
    
  } catch (error: any) {
    console.error('Erro ao exportar Excel:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao exportar Excel' },
      { status: 500 }
    )
  }
}
