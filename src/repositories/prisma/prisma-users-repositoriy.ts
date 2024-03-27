import { prisma } from '@/lib/prisma'
import { UserRepository } from '@/repositories/users-repositorys'
import { Prisma, User } from '@prisma/client'

export class PrismaUsersRepository implements UserRepository {
    async findById(userId: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })

        return user
    }

    async findByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        return user
    }
    async create(data: Prisma.UserCreateInput) {
        const user = await prisma.user.create({
            data,
        })

        return user
    }
}
