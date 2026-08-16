import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
export declare class ResourcesController {
    private readonly resourcesService;
    constructor(resourcesService: ResourcesService);
    create(topicId: number, createResourceDto: CreateResourceDto): unknown;
    findAllByTopic(topicId: number): unknown;
    findOne(id: number): unknown;
    update(id: number, updateResourceDto: UpdateResourceDto): unknown;
    remove(id: number): unknown;
}
