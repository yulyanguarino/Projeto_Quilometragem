
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { isTestMode } from '@/lib/auth'

export default async function Home() {
  const session = await getServerSession(authOptions)
  
  // Se estiver em modo de teste ou autenticado, vai para o dashboard
  if (isTestMode() || session) {
    redirect('/dashboard')
  }
  
  // Senão, vai para o login
  redirect('/login')
}
