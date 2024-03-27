import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryUserReporitory } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUsersProfileUseCase } from './get-user-profile'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

describe('Get User Profile Use Case', () => {
    let userRepository: InMemoryUserReporitory
    let getUserProfileUseCase: GetUsersProfileUseCase

    beforeEach(() => {
        userRepository = new InMemoryUserReporitory()
        getUserProfileUseCase = new GetUsersProfileUseCase(userRepository)
    })

    it('should be able to get user profile', async () => {
        const createdUser = await userRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6),
        })

        const { user } = await getUserProfileUseCase.execute({
            userId: createdUser.id,
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to get user profile with wrong id', async () => {
        expect(() =>
            getUserProfileUseCase.execute({
                userId: 'non-existing-id',
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})
