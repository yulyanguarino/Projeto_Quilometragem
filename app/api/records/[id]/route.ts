import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { recordUpdateSchema, validateKilometers } from '@/lib/validations'
import { calculateDistance } from '@/lib/utils'
import { isTestMode } from '@/lib/auth'

/**
 * GET /api/records/[id]
 * Obtém um registro específico
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const record = await prisma.record.findUnique({
      where: { id: params.id },
      include: {
        vehicle: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })
    
    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Registro não encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: record
    })
    
  } catch (error: any) {
    console.error('Erro ao buscar registro:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar registro' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/records/[id]
 * Atualiza um registro existente
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    
    // Busca registro atual
    const currentRecord = await prisma.record.findUnique({
      where: { id: params.id }
    })
    
    if (!currentRecord) {
      return NextResponse.json(
        { success: false, error: 'Registro não encontrado' },
        { status: 404 }
      )
    }
    
    // Valida dados
    const validatedData = recordUpdateSchema.parse(body)
    
    // Prepara dados para atualização
    const updateData: any = {}
    const changes: any[] = []
    
    // Mapeia campos alterados
    const fieldMap: Record<string, string> = {
      driverName: 'Condutor',
      departureDate: 'Data de Saída',
      arrivalDate: 'Data de Chegada',
      initialKm: 'KM Inicial',
      finalKm: 'KM Final',
      purpose: 'Motivo',
      observations: 'Observações'
    }
    
    // Verifica mudanças e prepara histórico
    for (const [key, value] of Object.entries(validatedData)) {
      if (value !== undefined && value !== null) {
        const currentValue = (currentRecord as any)[key]
        const newValue = key.includes('Date') ? new Date(value as string) : value
        
        if (JSON.stringify(currentValue) !== JSON.stringify(newValue)) {
          updateData[key] = newValue
          
          changes.push({
            recordId: params.id,
            userId: isTestMode() ? null : session?.user?.id,
            fieldChanged: fieldMap[key] || key,
            previousValue: String(currentValue),
            newValue: String(newValue),
          })
        }
      }
    }
    
    // Valida e atualiza quilometragem
    const initialKm = updateData.initialKm ?? currentRecord.initialKm
    const finalKm = updateData.finalKm ?? currentRecord.finalKm
    
    const kmValidation = validateKilometers(initialKm, finalKm)
    
    if (!kmValidation.valid) {
      return NextResponse.json(
        { success: false, error: kmValidation.error },
        { status: 400 }
      )
    }
    
    // Recalcula distância se necessário
    if (updateData.initialKm || updateData.finalKm) {
      updateData.distanceTraveled = calculateDistance(initialKm, finalKm)
    }
    
    // Atualiza registro
    const updatedRecord = await prisma.record.update({
      where: { id: params.id },
      data: updateData,
      include: {
        vehicle: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })
    
    // Salva histórico de alterações
    if (changes.length > 0) {
      await prisma.changeHistory.createMany({
        data: changes
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Registro atualizado com sucesso',
      data: updatedRecord
    })
    
  } catch (error: any) {
    console.error('Erro ao atualizar registro:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao atualizar registro' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/records/[id]
 * Deleta um registro
 */
export async function DELETE(
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
    
    // Delete registro (histórico é deletado automaticamente via cascade)
    await prisma.record.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Registro deletado com sucesso'
    })
    
  } catch (error: any) {
    console.error('Erro ao deletar registro:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar registro' },
      { status: 500 }
    )
  }
}
