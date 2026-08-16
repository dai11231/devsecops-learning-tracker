import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(userId: number): Promise<{
        overall: {
            totalTopics: number;
            completedTopics: number;
            percentage: number;
        };
        categories: {
            id: number;
            name: string;
            totalTopics: number;
            completedTopics: number;
            percentage: number;
        }[];
    }>;
}
