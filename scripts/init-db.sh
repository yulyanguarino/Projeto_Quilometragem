
#!/bin/bash

echo "🔧 Inicializando banco de dados..."

# Gera Prisma Client
echo "📦 Gerando Prisma Client..."
npx prisma generate

# Executa migrations
echo "🗄️  Executando migrations..."
npx prisma migrate deploy

# Executa seed
echo "🌱 Populando banco de dados..."
npx prisma db seed

echo "✅ Banco de dados inicializado com sucesso!"
echo ""
echo "Credenciais padrão:"
echo "Email: admin@quilometragem.com"
echo "Senha: admin123"
echo ""
echo "⚠️  IMPORTANTE: Altere a senha padrão após o primeiro acesso!"
