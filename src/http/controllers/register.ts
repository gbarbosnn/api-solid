import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeUserUseCase } from '@/use-cases/factories/make-register-users-repository'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { name, email, password } = registerBodySchema.parse(request.body)

    try {
        const registerUseCase = makeUserUseCase()

        await registerUseCase.execute({ name, email, password })
    } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
            return reply.status(409).send({
                message: error.message,
            })
        }

        throw error
    }

    reply.status(201).send()
}
