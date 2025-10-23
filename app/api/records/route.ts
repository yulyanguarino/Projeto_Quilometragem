import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { recordCreateSchema, validateKilometers } from '@/lib/validations'
import { calculateDistance } from '@/lib/utils'
import { isTestMode } from '@/lib/auth'

/**
 * GET /api/records
 * Lista todos os registros com filtros opcionais
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const driverName = searchParams.get('driverName')
    const licensePlate = searchParams.get('licensePlate')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    // Constrói filtros
    const where: any = {}
    
    if (driverName) {
      where.driverName = {
        contains: driverName,
        mode: 'insensitive'
      }
    }
    
    if (licensePlate) {
      where.vehicle = {
        licensePlate: {
          contains: licensePlate,
          mode: 'insensitive'
        }
      }
    }
    
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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        departureDate: 'desc'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: records
    })
    
  } catch (error: any) {
    console.error('Erro ao listar registros:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao listar registros' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/records
 * Cria um novo registro de quilometragem
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    
    // Valida dados
    const validatedData = recordCreateSchema.parse(body)
    
    // Valida quilometragem
    const kmValidation = validateKilometers(
      validatedData.initialKm,
      validatedData.finalKm
    )
    
    if (!kmValidation.valid) {
      return NextResponse.json(
        { success: false, error: kmValidation.error },
        { status: 400 }
      )
    }
    
    // Calcula distância
    const distanceTraveled = calculateDistance(
      validatedData.initialKm,
      validatedData.finalKm
    )
    
    // Cria registro
    const record = await prisma.record.create({
      data: {
        vehicleId: validatedData.vehicleId,
        userId: isTestMode() ? null : session?.user?.id,
        driverName: validatedData.driverName,
        departureDate: new Date(validatedData.departureDate),
        arrivalDate: new Date(validatedData.arrivalDate),
        initialKm: validatedData.initialKm,
        finalKm: validatedData.finalKm,
        distanceTraveled,
        purpose: validatedData.purpose,
        observations: validatedData.observations,
      },
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
    
    return NextResponse.json({
      success: true,
      message: 'Registro criado com sucesso',
      data: record
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Erro ao criar registro:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao criar registro' },
      { status: 500 }
    )
  }
}
