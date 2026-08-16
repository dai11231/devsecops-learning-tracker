import { PrismaService } from '../prisma/prisma.service';
import { TopicsService } from '../topics/topics.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
export declare class NotesService {
    private prisma;
    private topicsService;
    constructor(prisma: PrismaService, topicsService: TopicsService);
    create(topicId: number, createNoteDto: CreateNoteDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        topicId: number;
        content: string;
        title: string;
    }>;
    findAllByTopic(topicId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        topicId: number;
        content: string;
        title: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        topicId: number;
        content: string;
        title: string;
    }>;
    update(id: number, updateNoteDto: UpdateNoteDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        topicId: number;
        content: string;
        title: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        topicId: number;
        content: string;
        title: string;
    }>;
}
