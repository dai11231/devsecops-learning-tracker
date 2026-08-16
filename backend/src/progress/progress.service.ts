import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { ProgressStatus } from '@prisma/client';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.progress.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(userId: number, topicId: number) {
    const progress = await this.prisma.progress.findUnique({
      where: {
        userId_topicId: { userId, topicId },
      },
    });
    if (!progress) {
      throw new NotFoundException('Progress not found for this topic');
    }
    return progress;
  }

  async upsertProgress(userId: number, topicId: number, dto: UpdateProgressDto) {
    // Validate that the topic exists first
    const topic = await this.prisma.topic.findUnique({ where: { id: topicId } });
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    const completedAt = dto.status === ProgressStatus.COMPLETED ? new Date() : null;

    return this.prisma.progress.upsert({
      where: {
        userId_topicId: { userId, topicId },
      },
      update: {
        status: dto.status,
        completedAt,
      },
      create: {
        userId,
        topicId,
        status: dto.status,
        completedAt,
      },
    });
  }
}
