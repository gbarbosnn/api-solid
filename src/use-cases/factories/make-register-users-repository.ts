import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repositoriy'
import { RegisterUseCase } from '../../register'

export function makeRegisterUserUseCase() {
    const usersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    return registerUseCase
}
