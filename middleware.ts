
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Verifica se está em modo de teste
const isTestMode = process.env.APP_MODE === 'test'

export default withAuth(
  function middleware(req) {
    // Se estiver em modo de teste, permite acesso sem autenticação
    if (isTestMode) {
      return NextResponse.next()
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Se estiver em modo de teste, sempre autoriza
        if (isTestMode) {
          return true
        }
        
        // Páginas públicas
        const publicPaths = ['/login', '/register', '/api/auth']
        if (publicPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
          return true
        }
        
        // Requer autenticação para outras rotas
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
