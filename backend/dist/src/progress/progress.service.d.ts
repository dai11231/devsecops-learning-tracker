import { PrismaService } from '../prisma/prisma.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
export declare class ProgressService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ProgressStatus;
        completedAt: Date | null;
        topicId: number;
        userId: number;
    }[]>;
    findOne(userId: number, topicId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ProgressStatus;
        completedAt: Date | null;
        topicId: number;
        userId: number;
    }>;
    upsertProgress(userId: number, topicId: number, dto: UpdateProgressDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ProgressStatus;
        completedAt: Date | null;
        topicId: number;
        userId: number;
    }>;
}
