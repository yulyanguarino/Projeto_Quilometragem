
# 🚀 Guia de Deploy - Sistema de Quilometragem Veicular

## Deploy no Vercel (Recomendado)

O Vercel oferece hosting gratuito 24/7 com excelente performance para aplicações NextJS.

### Pré-requisitos

1. Conta no GitHub
2. Conta no Vercel (gratuita)
3. Banco de dados PostgreSQL (opções gratuitas abaixo)

### Opções de Banco de Dados PostgreSQL Gratuito

#### 1. **Neon (Recomendado)** 
- ✅ 100% gratuito
- ✅ Serverless PostgreSQL
- ✅ 24/7 disponível
- 🔗 https://neon.tech

#### 2. **Supabase**
- ✅ Plano gratuito generoso
- ✅ PostgreSQL + ferramentas extras
- 🔗 https://supabase.com

#### 3. **ElephantSQL**
- ✅ Plano gratuito disponível
- ✅ PostgreSQL gerenciado
- 🔗 https://www.elephantsql.com

### Passo a Passo

#### 1. Preparar o Repositório

```bash
# Inicializar git (se ainda não foi feito)
git init

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "Initial commit - Sistema de Quilometragem"

# Criar repositório no GitHub e fazer push
git remote add origin <seu-repositorio-github>
git push -u origin main
```

#### 2. Criar Banco de Dados PostgreSQL

**Exemplo com Neon:**

1. Acesse https://neon.tech
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a Connection String (DATABASE_URL)

#### 3. Deploy no Vercel

1. Acesse https://vercel.com
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Importe seu repositório GitHub
5. Configure as variáveis de ambiente:

```env
DATABASE_URL=postgresql://user:password@host/database
NEXTAUTH_URL=https://seu-app.vercel.app
NEXTAUTH_SECRET=gere-um-secret-aleatorio-aqui
APP_MODE=production
```

**Gerar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

6. Clique em "Deploy"

#### 4. Executar Migrações do Prisma

Após o primeiro deploy, você precisa executar as migrações:

**Opção 1: Via Vercel CLI**
```bash
npx vercel env pull
npx prisma migrate deploy
npx prisma db seed
```

**Opção 2: Localmente**
```bash
# Configure DATABASE_URL local para o banco de produção
DATABASE_URL="sua-url-de-producao" npx prisma migrate deploy
DATABASE_URL="sua-url-de-producao" npx prisma db seed
```

### Credenciais Padrão

Após o seed, você pode fazer login com:
- **Email:** admin@quilometragem.com
- **Senha:** admin123

⚠️ **IMPORTANTE:** Altere a senha padrão após o primeiro acesso!

### Versão de Testes

Para criar uma versão de testes (sem autenticação):

1. Crie um novo projeto no Vercel
2. Configure a variável de ambiente:
```env
APP_MODE=test
DATABASE_URL_TEST=sua-url-do-banco-de-testes
```

## Deploy Alternativo: Railway

Railway também oferece hosting gratuito com PostgreSQL incluso.

### Passo a Passo

1. Acesse https://railway.app
2. Conecte com GitHub
3. Clique em "New Project"
4. Selecione "Deploy from GitHub repo"
5. Escolha seu repositório
6. Railway automaticamente detecta NextJS
7. Adicione um banco PostgreSQL:
   - Clique em "New" > "Database" > "PostgreSQL"
8. Configure as variáveis de ambiente no painel do Railway

## Monitoramento

### Logs

**Vercel:**
```bash
npx vercel logs <deployment-url>
```

**Railway:**
Acesse o dashboard > View Logs

### Health Check

Crie um endpoint de health check:
```
GET /api/health
```

## Troubleshooting

### Erro: "Prisma Client não encontrado"

```bash
# Execute no projeto
npx prisma generate
git add .
git commit -m "Generate Prisma Client"
git push
```

### Erro de Conexão com Banco

1. Verifique se DATABASE_URL está correta
2. Verifique se o IP do Vercel está permitido no firewall do banco
3. Use SSL na connection string: `?sslmode=require`

### Erro de Autenticação

1. Verifique NEXTAUTH_SECRET
2. Verifique NEXTAUTH_URL (deve ser a URL de produção)
3. Limpe cookies e tente novamente

## Performance

### Otimizações Aplicadas

- ✅ Static Generation onde possível
- ✅ API Routes otimizadas
- ✅ Connection pooling do Prisma
- ✅ Caching de queries
- ✅ Minificação automática pelo Vercel

### Métricas Esperadas

- **Time to First Byte (TTFB):** < 200ms
- **Lighthouse Score:** > 90
- **Uptime:** 99.9%

## Custos

### Vercel (Plano Hobby - Gratuito)
- ✅ Bandwidth: 100GB/mês
- ✅ Builds: Ilimitados
- ✅ Domínio: vercel.app (gratuito)
- ✅ SSL: Automático
- ✅ Sem "sleep mode"

### Neon (Plano Free)
- ✅ 1 projeto
- ✅ 10GB de storage
- ✅ Compute: 300 horas/mês
- ✅ Sem "sleep mode"

## Domínio Personalizado

### Adicionar no Vercel

1. Acesse seu projeto no Vercel
2. Settings > Domains
3. Adicione seu domínio
4. Configure DNS (CNAME ou A record)
5. SSL automático via Let's Encrypt

## Backup

### Backup do Banco de Dados

**Neon:**
```bash
pg_dump $DATABASE_URL > backup.sql
```

**Restaurar:**
```bash
psql $DATABASE_URL < backup.sql
```

## Suporte

- 📧 Email: suporte@exemplo.com
- 📚 Documentação: https://github.com/seu-repo
- 🐛 Issues: https://github.com/seu-repo/issues

---

**Desenvolvido com ❤️ usando NextJS 14 + PostgreSQL + Prisma**
