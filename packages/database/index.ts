// @author: fatima bashir
export { PrismaClient } from '@prisma/client'
export * from '@prisma/client'

// Re-export for convenience
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

