import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({ data: createCategoryDto });
    } catch (e) {
      if (e.code === 'P2002') throw new ConflictException('Slug already exists');
      throw e;
    }
  }

  findAll() {
    return this.prisma.category.findMany({ orderBy: { order: 'asc' } });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id); // Ensure exists
    try {
      return await this.prisma.category.update({ where: { id }, data: updateCategoryDto });
    } catch (e) {
      if (e.code === 'P2002') throw new ConflictException('Slug already exists');
      throw e;
    }
  }

  async remove(id: number) {
    await this.findOne(id); // Ensure exists
    try {
      return await this.prisma.category.delete({ where: { id } });
    } catch (e) {
      // Prisma error for Restrict violation (foreign key constraint)
      if (e.code === 'P2003') {
        throw new ConflictException('Cannot delete category because it contains topics');
      }
      throw e;
    }
  }
}
