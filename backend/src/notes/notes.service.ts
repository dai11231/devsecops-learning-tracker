import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TopicsService } from '../topics/topics.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    private prisma: PrismaService,
    private topicsService: TopicsService
  ) {}

  async create(topicId: number, createNoteDto: CreateNoteDto) {
    await this.topicsService.findOne(topicId); // throws 404 if not found
    return this.prisma.note.create({
      data: { ...createNoteDto, topicId },
    });
  }

  async findAllByTopic(topicId: number) {
    await this.topicsService.findOne(topicId); // throws 404 if not found
    return this.prisma.note.findMany({
      where: { topicId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    await this.findOne(id);
    return this.prisma.note.update({
      where: { id },
      data: updateNoteDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.note.delete({ where: { id } });
  }
}
