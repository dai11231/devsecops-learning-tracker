import { PrismaService } from '../prisma/prisma.service';
import { TopicsService } from '../topics/topics.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
export declare class ResourcesService {
    private prisma;
    private topicsService;
    constructor(prisma: PrismaService, topicsService: TopicsService);
    create(topicId: number, createResourceDto: CreateResourceDto): unknown;
    findAllByTopic(topicId: number): unknown;
    findOne(id: number): unknown;
    update(id: number, updateResourceDto: UpdateResourceDto): unknown;
    remove(id: number): unknown;
}
