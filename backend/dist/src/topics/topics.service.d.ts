import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
export declare class TopicsService {
    private prisma;
    private categoriesService;
    constructor(prisma: PrismaService, categoriesService: CategoriesService);
    create(categoryId: number, createTopicDto: CreateTopicDto): unknown;
    findAllByCategory(categoryId: number): unknown;
    findOne(id: number): unknown;
    update(id: number, updateTopicDto: UpdateTopicDto): unknown;
    remove(id: number): unknown;
}
