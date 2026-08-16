import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
export declare class ResourcesController {
    private readonly resourcesService;
    constructor(resourcesService: ResourcesService);
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
