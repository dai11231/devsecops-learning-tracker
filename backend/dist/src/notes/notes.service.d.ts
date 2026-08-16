import { PrismaService } from '../prisma/prisma.service';
import { TopicsService } from '../topics/topics.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
export declare class NotesService {
    private prisma;
    private topicsService;
    constructor(prisma: PrismaService, topicsService: TopicsService);
    create(topicId: number, createNoteDto: CreateNoteDto): unknown;
    findAllByTopic(topicId: number): unknown;
    findOne(id: number): unknown;
    update(id: number, updateNoteDto: UpdateNoteDto): unknown;
    remove(id: number): unknown;
}
