import { UserRepository } from '@/repositories/users-repositorys'
import { InvalidCredintialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'

interface AuthenticUseCaseRequest {
    email: string
    password: string
}

interface AuthenticUseCaseResponse {
    user: User
}

export class AuthenticateUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute({
        email,
        password,
    }: AuthenticUseCaseRequest): Promise<AuthenticUseCaseResponse> {
        const user = await this.userRepository.findByEmail(email)

        if (!user) {
            throw new InvalidCredintialsError()
        }

        const doesPasswordMatches = await compare(password, user.password_hash)

        if (!doesPasswordMatches) {
            throw new InvalidCredintialsError()
        }

        return { user }
    }
}
