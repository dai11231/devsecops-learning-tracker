import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
export declare class TopicsController {
    private readonly topicsService;
    constructor(topicsService: TopicsService);
    create(categoryId: number, createTopicDto: CreateTopicDto): unknown;
    findAllByCategory(categoryId: number): unknown;
    findOne(id: number): unknown;
    update(id: number, updateTopicDto: UpdateTopicDto): unknown;
    remove(id: number): unknown;
}
