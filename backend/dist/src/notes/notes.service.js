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
exports.NotesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const topics_service_1 = require("../topics/topics.service");
let NotesService = class NotesService {
    prisma;
    topicsService;
    constructor(prisma, topicsService) {
        this.prisma = prisma;
        this.topicsService = topicsService;
    }
    async create(topicId, createNoteDto) {
        await this.topicsService.findOne(topicId);
        return this.prisma.note.create({
            data: { ...createNoteDto, topicId },
        });
    }
    async findAllByTopic(topicId) {
        await this.topicsService.findOne(topicId);
        return this.prisma.note.findMany({
            where: { topicId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const note = await this.prisma.note.findUnique({ where: { id } });
        if (!note)
            throw new common_1.NotFoundException('Note not found');
        return note;
    }
    async update(id, updateNoteDto) {
        await this.findOne(id);
        return this.prisma.note.update({
            where: { id },
            data: updateNoteDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.note.delete({ where: { id } });
    }
};
exports.NotesService = NotesService;
exports.NotesService = NotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        topics_service_1.TopicsService])
], NotesService);
//# sourceMappingURL=notes.service.js.map