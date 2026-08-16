import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboard(req: any): Promise<{
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
