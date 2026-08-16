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
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ProgressService = class ProgressService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId) {
        return this.prisma.progress.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async findOne(userId, topicId) {
        const progress = await this.prisma.progress.findUnique({
            where: {
                userId_topicId: { userId, topicId },
            },
        });
        if (!progress) {
            throw new common_1.NotFoundException('Progress not found for this topic');
        }
        return progress;
    }
    async upsertProgress(userId, topicId, dto) {
        const topic = await this.prisma.topic.findUnique({ where: { id: topicId } });
        if (!topic) {
            throw new common_1.NotFoundException('Topic not found');
        }
        const completedAt = dto.status === client_1.ProgressStatus.COMPLETED ? new Date() : null;
        return this.prisma.progress.upsert({
            where: {
                userId_topicId: { userId, topicId },
            },
            update: {
                status: dto.status,
                completedAt,
            },
            create: {
                userId,
                topicId,
                status: dto.status,
                completedAt,
            },
        });
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map