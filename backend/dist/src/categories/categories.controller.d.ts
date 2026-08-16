import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): unknown;
    findAll(): any;
    findOne(id: number): unknown;
    update(id: number, updateCategoryDto: UpdateCategoryDto): unknown;
    remove(id: number): unknown;
}
