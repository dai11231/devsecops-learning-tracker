import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(usernameOrEmail: string): Promise<User | null>;
    create(data: Prisma.UserCreateInput): Promise<User>;
}
