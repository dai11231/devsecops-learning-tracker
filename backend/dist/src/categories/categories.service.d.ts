import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCategoryDto: CreateCategoryDto): unknown;
    findAll(): any;
    findOne(id: number): unknown;
    update(id: number, updateCategoryDto: UpdateCategoryDto): unknown;
    remove(id: number): unknown;
}
