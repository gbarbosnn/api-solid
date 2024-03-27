import { hash } from 'bcryptjs'
import { UserRepository } from './repositories/users-repositorys'
import { UserAlreadyExistsError } from './use-cases/errors/user-already-exists-error'
import { User } from '@prisma/client'

interface registerUseCaseRequest {
    name: string
    email: string
    password: string
}

interface RegisterUseCaseResponse {
    user: User
}

export class RegisterUseCase {
    constructor(private usersRepository: UserRepository) {}

    async execute({
        name,
        email,
        password,
    }: registerUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const password_hash = await hash(password, 6)

        const userWithSameEmail = await this.usersRepository.findByEmail(email)

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError()
        }

        const user = await this.usersRepository.create({
            name,
            email,
            password_hash,
        })

        return { user }
    }
}
