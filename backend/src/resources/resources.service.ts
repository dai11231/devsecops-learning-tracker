import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TopicsService } from '../topics/topics.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Injectable()
export class ResourcesService {
  constructor(
    private prisma: PrismaService,
    private topicsService: TopicsService
  ) {}

  async create(topicId: number, createResourceDto: CreateResourceDto) {
    await this.topicsService.findOne(topicId); // throws 404 if not found
    return this.prisma.resource.create({
      data: { ...createResourceDto, topicId },
    });
  }

  async findAllByTopic(topicId: number) {
    await this.topicsService.findOne(topicId); // throws 404 if not found
    return this.prisma.resource.findMany({
      where: { topicId },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: number) {
    const resource = await this.prisma.resource.findUnique({ where: { id } });
    if (!resource) throw new NotFoundException('Resource not found');
    return resource;
  }

  async update(id: number, updateResourceDto: UpdateResourceDto) {
    await this.findOne(id);
    return this.prisma.resource.update({
      where: { id },
      data: updateResourceDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.resource.delete({ where: { id } });
  }
}
