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
exports.TopicsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const categories_service_1 = require("../categories/categories.service");
let TopicsService = class TopicsService {
    prisma;
    categoriesService;
    constructor(prisma, categoriesService) {
        this.prisma = prisma;
        this.categoriesService = categoriesService;
    }
    async create(categoryId, createTopicDto) {
        await this.categoriesService.findOne(categoryId);
        try {
            return await this.prisma.topic.create({
                data: { ...createTopicDto, categoryId },
            });
        }
        catch (e) {
            if (e.code === 'P2002')
                throw new common_1.ConflictException('Slug already exists');
            throw e;
        }
    }
    async findAllByCategory(categoryId) {
        await this.categoriesService.findOne(categoryId);
        return this.prisma.topic.findMany({
            where: { categoryId },
            orderBy: { order: 'asc' },
        });
    }
    async findOne(id) {
        const topic = await this.prisma.topic.findUnique({ where: { id } });
        if (!topic)
            throw new common_1.NotFoundException('Topic not found');
        return topic;
    }
    async update(id, updateTopicDto) {
        await this.findOne(id);
        try {
            return await this.prisma.topic.update({
                where: { id },
                data: updateTopicDto,
            });
        }
        catch (e) {
            if (e.code === 'P2002')
                throw new common_1.ConflictException('Slug already exists');
            throw e;
        }
    }
    async remove(id) {
        await this.findOne(id);
        try {
            return await this.prisma.topic.delete({ where: { id } });
        }
        catch (e) {
            if (e.code === 'P2003') {
                throw new common_1.ConflictException('Cannot delete topic because it contains notes or resources');
            }
            throw e;
        }
    }
};
exports.TopicsService = TopicsService;
exports.TopicsService = TopicsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        categories_service_1.CategoriesService])
], TopicsService);
//# sourceMappingURL=topics.service.js.map