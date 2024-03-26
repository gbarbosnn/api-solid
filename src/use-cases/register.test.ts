import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'

import { compare } from 'bcryptjs'
import { InMemoryUserReporitory } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
    let userRepository: InMemoryUserReporitory
    let registerUseCase: RegisterUseCase

    beforeEach(() => {
        userRepository = new InMemoryUserReporitory()
        registerUseCase = new RegisterUseCase(userRepository)
    })

    it('should be able to register', async () => {
        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () => {
        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        const isPasswordCorrectylyHashed = await compare(
            '123456',
            user.password_hash
        )

        expect(isPasswordCorrectylyHashed).toBe(true)
    })

    it('should not be able to register whit email twice', async () => {
        const email = 'johndoe@example.com'

        await registerUseCase.execute({
            name: 'John Doe',
            email,
            password: '123456',
        })

        await expect(() =>
            registerUseCase.execute({
                name: 'John Doe',
                email,
                password: '123456',
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})
