# 🚗 Sistema de Registro de Quilometragem de Veículos

Sistema web completo para registro e gerenciamento de quilometragem de veículos, desenvolvido com NextJS e PostgreSQL.

## 📋 Descrição

Aplicação web moderna e responsiva para controle eficiente da quilometragem de veículos, permitindo registro detalhado de uso, acompanhamento histórico e geração de relatórios completos.

## ✨ Funcionalidades Principais

- **Registro de Uso de Veículos**: Interface intuitiva para registrar saídas e retornos de veículos
- **Histórico Completo**: Visualização detalhada de todos os registros com filtros avançados
- **Cálculos Automáticos**: Cálculo automático de quilometragem percorrida e tempo de uso
- **Exportação de Relatórios**: Geração de relatórios em múltiplos formatos (PDF, Excel, CSV)
- **Interface Responsiva**: Design adaptável para desktop, tablet e mobile
- **Sistema de Autenticação**: Controle de acesso seguro com autenticação de usuários
- **Gestão de Veículos**: Cadastro e gerenciamento completo da frota
- **Dashboard Analítico**: Visualização de estatísticas e métricas de uso

## 🛠️ Tecnologias Utilizadas

### Frontend
- **NextJS 14**: Framework React com App Router
- **React 18**: Biblioteca para construção de interfaces
- **TypeScript**: Tipagem estática para maior segurança
- **Tailwind CSS**: Framework CSS utilitário
- **Shadcn/ui**: Componentes UI modernos e acessíveis
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de schemas

### Backend
- **NextJS API Routes**: Endpoints serverless
- **PostgreSQL**: Banco de dados relacional
- **Prisma ORM**: Object-Relational Mapping
- **NextAuth.js**: Autenticação completa

### Ferramentas de Desenvolvimento
- **ESLint**: Linting de código
- **Prettier**: Formatação de código
- **TypeScript**: Verificação de tipos

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL 14+ instalado e rodando
- npm ou yarn

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/yulyanguarino/Projeto_Quilometragem.git
cd Projeto_Quilometragem
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/quilometragem"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"

# Opcional: Configurações adicionais
NODE_ENV="development"
```

4. **Configure o banco de dados**

Execute as migrations do Prisma:

```bash
npx prisma generate
npx prisma db push
```

5. **Popule o banco de dados (opcional)**

Para dados de teste:

```bash
npx prisma db seed
```

## 🚀 Como Executar

### Modo Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Acesse a aplicação em: `http://localhost:3000`

### Modo Produção

1. **Build da aplicação**
```bash
npm run build
# ou
yarn build
```

2. **Inicie o servidor**
```bash
npm start
# ou
yarn start
```

## 📁 Estrutura do Projeto

```
Projeto_Quilometragem/
├── app/                      # App Router do NextJS
│   ├── api/                 # API Routes
│   ├── auth/                # Páginas de autenticação
│   ├── dashboard/           # Dashboard principal
│   ├── vehicles/            # Gestão de veículos
│   ├── records/             # Registros de quilometragem
│   └── reports/             # Relatórios e exportações
├── components/              # Componentes React reutilizáveis
│   ├── ui/                  # Componentes UI base
│   ├── forms/               # Formulários
│   └── layouts/             # Layouts da aplicação
├── lib/                     # Utilitários e configurações
│   ├── prisma.ts           # Cliente Prisma
│   ├── auth.ts             # Configuração NextAuth
│   └── utils.ts            # Funções auxiliares
├── prisma/                  # Schema e migrations do Prisma
│   ├── schema.prisma       # Definição do banco de dados
│   └── migrations/         # Histórico de migrations
├── public/                  # Arquivos estáticos
├── styles/                  # Estilos globais
├── types/                   # Definições TypeScript
├── .env.example            # Exemplo de variáveis de ambiente
├── .gitignore              # Arquivos ignorados pelo Git
├── next.config.js          # Configuração do NextJS
├── package.json            # Dependências do projeto
├── tailwind.config.js      # Configuração do Tailwind
└── tsconfig.json           # Configuração do TypeScript
```

## 🔐 Autenticação

O sistema utiliza NextAuth.js para autenticação segura. Na versão de teste, você pode usar:

- **Email**: teste@exemplo.com
- **Senha**: teste123

> ⚠️ **Importante**: Altere as credenciais padrão em ambiente de produção!

## 📊 Funcionalidades Detalhadas

### Registro de Quilometragem
- Registro de saída com quilometragem inicial
- Registro de retorno com quilometragem final
- Cálculo automático da distância percorrida
- Registro de motorista e finalidade do uso

### Relatórios
- Filtros por período, veículo e motorista
- Exportação em PDF com formatação profissional
- Exportação em Excel com dados estruturados
- Exportação em CSV para análise de dados

### Dashboard
- Visão geral de uso da frota
- Gráficos de quilometragem por período
- Estatísticas de uso por veículo
- Alertas e notificações

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👤 Autor

**Yulyan Guarino**
- GitHub: [@yulyanguarino](https://github.com/yulyanguarino)

## 📞 Suporte

Para questões e suporte, abra uma issue no repositório do GitHub.

---

Desenvolvido com ❤️ usando NextJS e PostgreSQL
