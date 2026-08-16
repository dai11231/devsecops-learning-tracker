"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard(userId) {
        const totalTopics = await this.prisma.topic.count();
        const completedProgresses = await this.prisma.progress.findMany({
            where: {
                userId,
                status: client_1.ProgressStatus.COMPLETED,
            },
            select: { topicId: true },
        });
        const completedTopicIds = new Set(completedProgresses.map((p) => p.topicId));
        const completedTopicsCount = completedTopicIds.size;
        const overallPercentage = totalTopics === 0
            ? 0
            : Number(((completedTopicsCount / totalTopics) * 100).toFixed(2));
        const categories = await this.prisma.category.findMany({
            include: {
                topics: {
                    select: { id: true },
                },
            },
            orderBy: { order: 'asc' },
        });
        const categoriesStats = categories.map((cat) => {
            const catTotalTopics = cat.topics.length;
            let catCompletedTopics = 0;
            for (const topic of cat.topics) {
                if (completedTopicIds.has(topic.id)) {
                    catCompletedTopics++;
                }
            }
            const catPercentage = catTotalTopics === 0
                ? 0
                : Number(((catCompletedTopics / catTotalTopics) * 100).toFixed(2));
            return {
                id: cat.id,
                name: cat.name,
                totalTopics: catTotalTopics,
                completedTopics: catCompletedTopics,
                percentage: catPercentage,
            };
        });
        return {
            overall: {
                totalTopics,
                completedTopics: completedTopicsCount,
                percentage: overallPercentage,
            },
            categories: categoriesStats,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map