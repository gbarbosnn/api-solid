import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repositoriy'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUsersRepository() {
    const usersRepository = new PrismaUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    return authenticateUseCase
}
