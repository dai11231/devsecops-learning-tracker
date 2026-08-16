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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicsController = void 0;
const common_1 = require("@nestjs/common");
const topics_service_1 = require("./topics.service");
const create_topic_dto_1 = require("./dto/create-topic.dto");
const update_topic_dto_1 = require("./dto/update-topic.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TopicsController = class TopicsController {
    topicsService;
    constructor(topicsService) {
        this.topicsService = topicsService;
    }
    create(categoryId, createTopicDto) {
        return this.topicsService.create(categoryId, createTopicDto);
    }
    findAllByCategory(categoryId) {
        return this.topicsService.findAllByCategory(categoryId);
    }
    findOne(id) {
        return this.topicsService.findOne(id);
    }
    update(id, updateTopicDto) {
        return this.topicsService.update(id, updateTopicDto);
    }
    remove(id) {
        return this.topicsService.remove(id);
    }
};
exports.TopicsController = TopicsController;
__decorate([
    (0, swagger_1.ApiTags)('categories'),
    (0, common_1.Post)('categories/:categoryId/topics'),
    (0, swagger_1.ApiOperation)({ summary: 'Create topic for a category' }),
    __param(0, (0, common_1.Param)('categoryId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_topic_dto_1.CreateTopicDto]),
    __metadata("design:returntype", void 0)
], TopicsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiTags)('categories'),
    (0, common_1.Get)('categories/:categoryId/topics'),
    (0, swagger_1.ApiOperation)({ summary: 'List topics by category' }),
    __param(0, (0, common_1.Param)('categoryId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TopicsController.prototype, "findAllByCategory", null);
__decorate([
    (0, swagger_1.ApiTags)('topics'),
    (0, common_1.Get)('topics/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get topic by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TopicsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiTags)('topics'),
    (0, common_1.Patch)('topics/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update topic' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_topic_dto_1.UpdateTopicDto]),
    __metadata("design:returntype", void 0)
], TopicsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiTags)('topics'),
    (0, common_1.Delete)('topics/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete topic' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TopicsController.prototype, "remove", null);
exports.TopicsController = TopicsController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [topics_service_1.TopicsService])
], TopicsController);
//# sourceMappingURL=topics.controller.js.map