import { UserRepository } from '@/repositories/users-repositorys'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUsersProfileUseCaseRequest {
    userId: string
}

interface GetUsersProfileUseCaseResponse {
    user: User
}

export class GetUsersProfileUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute({
        userId,
    }: GetUsersProfileUseCaseRequest): Promise<GetUsersProfileUseCaseResponse> {
        const user = await this.userRepository.findById(userId)

        if (!user) {
            throw new ResourceNotFoundError()
        }

        return { user }
    }
}
