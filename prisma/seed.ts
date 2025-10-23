
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')
  
  // Cria usuário admin
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@quilometragem.com' },
    update: {},
    create: {
      email: 'admin@quilometragem.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'admin',
    },
  })
  
  console.log('✅ Usuário admin criado:', admin.email)
  
  // Cria veículo padrão
  const vehicle = await prisma.vehicle.upsert({
    where: { licensePlate: 'ABC-1234' },
    update: {},
    create: {
      licensePlate: 'ABC-1234',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2023,
      color: 'Prata',
    },
  })
  
  console.log('✅ Veículo criado:', vehicle.licensePlate)
  
  // Cria registro de exemplo
  const record = await prisma.record.create({
    data: {
      vehicleId: vehicle.id,
      userId: admin.id,
      driverName: 'João Silva',
      departureDate: new Date('2024-01-01T08:00:00'),
      arrivalDate: new Date('2024-01-01T12:00:00'),
      initialKm: 10000,
      finalKm: 10150,
      distanceTraveled: 150,
      purpose: 'Reunião com cliente',
      observations: 'Viagem tranquila, sem intercorrências',
    },
  })
  
  console.log('✅ Registro de exemplo criado:', record.id)
  
  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
