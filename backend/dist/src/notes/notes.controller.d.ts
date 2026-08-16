import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
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
