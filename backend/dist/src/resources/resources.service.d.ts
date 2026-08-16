import { PrismaService } from '../prisma/prisma.service';
import { TopicsService } from '../topics/topics.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
export declare class ResourcesService {
    private prisma;
    private topicsService;
    constructor(prisma: PrismaService, topicsService: TopicsService);
    create(topicId: number, createResourceDto: CreateResourceDto): Promise<{
        url: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        topicId: number;
        type: string;
        title: string;
    }>;
    findAllByTopic(topicId: number): Promise<{
        url: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        topicId: number;
        type: string;
        title: string;
    }[]>;
    findOne(id: number): Promise<{
        url: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        topicId: number;
        type: string;
        title: string;
    }>;
    update(id: number, updateResourceDto: UpdateResourceDto): Promise<{
        url: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        topicId: number;
        type: string;
        title: string;
    }>;
    remove(id: number): Promise<{
        url: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        topicId: number;
        type: string;
        title: string;
    }>;
}
