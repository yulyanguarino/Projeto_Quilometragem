
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateCSV } from '@/lib/export'

/**
 * GET /api/export/csv
 * Exporta registros em formato CSV
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
    
    // Gera CSV
    const csv = generateCSV(records)
    
    // Retorna arquivo
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="quilometragem.csv"',
      },
    })
    
  } catch (error: any) {
    console.error('Erro ao exportar CSV:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao exportar CSV' },
      { status: 500 }
    )
  }
}
