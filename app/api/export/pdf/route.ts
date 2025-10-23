
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { preparePDFData } from '@/lib/export'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * GET /api/export/pdf
 * Exporta registros em formato PDF
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
    const data = preparePDFData(records)
    
    // Cria PDF
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })
    
    doc.setFontSize(18)
    doc.text('Relatório de Quilometragem', 14, 15)
    
    doc.setFontSize(10)
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 22)
    
    // Adiciona tabela
    autoTable(doc, {
      startY: 30,
      head: [['ID', 'Condutor', 'Placa', 'Saída', 'Chegada', 'KM Ini.', 'KM Fim', 'Dist.', 'Motivo']],
      body: data.map(record => [
        record.id,
        record.driverName,
        record.licensePlate,
        record.departureDate,
        record.arrivalDate,
        record.initialKm,
        record.finalKm,
        record.distanceTraveled,
        record.purpose,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [54, 96, 146] },
    })
    
    // Gera buffer
    const buffer = Buffer.from(doc.output('arraybuffer'))
    
    // Retorna arquivo
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="quilometragem.pdf"',
      },
    })
    
  } catch (error: any) {
    console.error('Erro ao exportar PDF:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao exportar PDF' },
      { status: 500 }
    )
  }
}
