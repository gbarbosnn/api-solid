import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryUserReporitory } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredintialsError } from './errors/invalid-credentials-error'

describe('Authenticate Use Case', () => {
    let userRepository: InMemoryUserReporitory
    let authenticateUseCase: AuthenticateUseCase

    beforeEach(() => {
        userRepository = new InMemoryUserReporitory()
        authenticateUseCase = new AuthenticateUseCase(userRepository)
    })

    it('should be able to authenticate', async () => {
        await userRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6),
        })

        const { user } = await authenticateUseCase.execute({
            email: 'johndoe@example.com',
            password: '123456',
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate with wrong email', async () => {
        expect(() =>
            authenticateUseCase.execute({
                email: 'johndoe@example.com',
                password: '123456',
            })
        ).rejects.toBeInstanceOf(InvalidCredintialsError)
    })

    it('should not be able to authenticate with wrong passwornd', async () => {
        await userRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6),
        })

        expect(() =>
            authenticateUseCase.execute({
                email: 'johndoe@example.com',
                password: '132154',
            })
        ).rejects.toBeInstanceOf(InvalidCredintialsError)
    })
})
