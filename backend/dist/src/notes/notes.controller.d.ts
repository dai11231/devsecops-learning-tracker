import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    create(topicId: number, createNoteDto: CreateNoteDto): unknown;
    findAllByTopic(topicId: number): unknown;
    findOne(id: number): unknown;
    update(id: number, updateNoteDto: UpdateNoteDto): unknown;
    remove(id: number): unknown;
}
