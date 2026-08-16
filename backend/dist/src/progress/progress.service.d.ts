import { PrismaService } from '../prisma/prisma.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
export declare class ProgressService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: number): unknown;
    findOne(userId: number, topicId: number): unknown;
    upsertProgress(userId: number, topicId: number, dto: UpdateProgressDto): unknown;
}
