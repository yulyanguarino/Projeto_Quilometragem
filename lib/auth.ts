
import bcrypt from 'bcryptjs'

/**
 * Hash de senha usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/**
 * Verifica se a senha corresponde ao hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * Verifica se o modo da aplicação é "test"
 */
export function isTestMode(): boolean {
  return process.env.APP_MODE === 'test'
}
