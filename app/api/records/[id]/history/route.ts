import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/records/[id]/history
 * Obtém histórico de alterações de um registro
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verifica se registro existe
    const record = await prisma.record.findUnique({
      where: { id: params.id }
    })
    
    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Registro não encontrado' },
        { status: 404 }
      )
    }
    
    // Busca histórico
    const history = await prisma.changeHistory.findMany({
      where: { recordId: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        changeDate: 'desc'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: history
    })
    
  } catch (error: any) {
    console.error('Erro ao buscar histórico:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar histórico' },
      { status: 500 }
    )
  }
}
