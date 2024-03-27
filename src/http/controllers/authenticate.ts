import { InvalidCredintialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUsersRepository } from '@/use-cases/factories/make-authenticate-users-repository'

import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { email, password } = authenticateBodySchema.parse(request.body)

    try {
        const authenticateUseCase = makeAuthenticateUsersRepository()

        await authenticateUseCase.execute({ email, password })
    } catch (error) {
        if (error instanceof InvalidCredintialsError) {
            return reply.status(400).send({
                message: error.message,
            })
        }

        throw error
    }

    reply.status(200).send()
}
