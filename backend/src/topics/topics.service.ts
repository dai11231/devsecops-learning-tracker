import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicsService {
  constructor(
    private prisma: PrismaService,
    private categoriesService: CategoriesService,
  ) {}

  async create(categoryId: number, createTopicDto: CreateTopicDto) {
    await this.categoriesService.findOne(categoryId); // throws 404 if not found
    try {
      return await this.prisma.topic.create({
        data: { ...createTopicDto, categoryId },
      });
    } catch (e) {
      if (e.code === 'P2002')
        throw new ConflictException('Slug already exists');
      throw e;
    }
  }

  async findAllByCategory(categoryId: number) {
    await this.categoriesService.findOne(categoryId); // throws 404 if not found
    return this.prisma.topic.findMany({
      where: { categoryId },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: number) {
    const topic = await this.prisma.topic.findUnique({ where: { id } });
    if (!topic) throw new NotFoundException('Topic not found');
    return topic;
  }

  async update(id: number, updateTopicDto: UpdateTopicDto) {
    await this.findOne(id);
    try {
      return await this.prisma.topic.update({
        where: { id },
        data: updateTopicDto,
      });
    } catch (e) {
      if (e.code === 'P2002')
        throw new ConflictException('Slug already exists');
      throw e;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    try {
      return await this.prisma.topic.delete({ where: { id } });
    } catch (e) {
      if (e.code === 'P2003') {
        throw new ConflictException(
          'Cannot delete topic because it contains notes or resources',
        );
      }
      throw e;
    }
  }
}
