import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiTags('topics')
  @Post('topics/:topicId/notes')
  @ApiOperation({ summary: 'Create note for a topic' })
  create(
    @Param('topicId', ParseIntPipe) topicId: number,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    return this.notesService.create(topicId, createNoteDto);
  }

  @ApiTags('topics')
  @Get('topics/:topicId/notes')
  @ApiOperation({ summary: 'List notes by topic' })
  findAllByTopic(@Param('topicId', ParseIntPipe) topicId: number) {
    return this.notesService.findAllByTopic(topicId);
  }

  @ApiTags('notes')
  @Get('notes/:id')
  @ApiOperation({ summary: 'Get note by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.findOne(id);
  }

  @ApiTags('notes')
  @Patch('notes/:id')
  @ApiOperation({ summary: 'Update note' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(id, updateNoteDto);
  }

  @ApiTags('notes')
  @Delete('notes/:id')
  @ApiOperation({ summary: 'Delete note' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.remove(id);
  }
}
