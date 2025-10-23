import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const vehicleCreateSchema = z.object({
  licensePlate: z.string().min(7, 'Placa deve ter no mínimo 7 caracteres'),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.number().optional(),
  color: z.string().optional(),
})

/**
 * GET /api/vehicles
 * Lista todos os veículos
 */
export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: vehicles
    })
    
  } catch (error: any) {
    console.error('Erro ao listar veículos:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao listar veículos' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/vehicles
 * Cria um novo veículo
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Valida dados
    const validatedData = vehicleCreateSchema.parse(body)
    
    // Verifica se placa já existe
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { licensePlate: validatedData.licensePlate }
    })
    
    if (existingVehicle) {
      return NextResponse.json(
        { success: false, error: 'Placa já cadastrada' },
        { status: 400 }
      )
    }
    
    // Cria veículo
    const vehicle = await prisma.vehicle.create({
      data: validatedData
    })
    
    return NextResponse.json({
      success: true,
      message: 'Veículo criado com sucesso',
      data: vehicle
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Erro ao criar veículo:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao criar veículo' },
      { status: 500 }
    )
  }
}
