import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  @ApiOperation({ summary: 'Get all progress for current user' })
  findAll(@Request() req: any) {
    return this.progressService.findAll(req.user.id);
  }

  @Get(':topicId')
  @ApiOperation({ summary: 'Get progress for a specific topic' })
  findOne(
    @Request() req: any,
    @Param('topicId', ParseIntPipe) topicId: number,
  ) {
    return this.progressService.findOne(req.user.id, topicId);
  }

  @Patch(':topicId')
  @ApiOperation({ summary: 'Upsert progress for a topic' })
  upsert(
    @Request() req: any,
    @Param('topicId', ParseIntPipe) topicId: number,
    @Body() dto: UpdateProgressDto,
  ) {
    return this.progressService.upsertProgress(req.user.id, topicId, dto);
  }
}
