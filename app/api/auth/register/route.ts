
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'

/**
 * POST /api/auth/register
 * Registra um novo usuário
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Valida dados
    const validatedData = registerSchema.parse(body)
    
    // Verifica se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email já cadastrado' },
        { status: 400 }
      )
    }
    
    // Hash da senha
    const hashedPassword = await hashPassword(validatedData.password)
    
    // Cria usuário
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: user
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Erro ao registrar usuário:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao registrar usuário' },
      { status: 500 }
    )
  }
}
