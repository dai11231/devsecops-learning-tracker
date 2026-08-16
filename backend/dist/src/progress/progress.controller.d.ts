import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    findAll(req: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ProgressStatus;
        completedAt: Date | null;
        topicId: number;
        userId: number;
    }[]>;
    findOne(req: any, topicId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ProgressStatus;
        completedAt: Date | null;
        topicId: number;
        userId: number;
    }>;
    upsert(req: any, topicId: number, dto: UpdateProgressDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ProgressStatus;
        completedAt: Date | null;
        topicId: number;
        userId: number;
    }>;
}
