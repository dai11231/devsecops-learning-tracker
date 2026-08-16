import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @ApiTags('categories')
  @Post('categories/:categoryId/topics')
  @ApiOperation({ summary: 'Create topic for a category' })
  create(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() createTopicDto: CreateTopicDto,
  ) {
    return this.topicsService.create(categoryId, createTopicDto);
  }

  @ApiTags('categories')
  @Get('categories/:categoryId/topics')
  @ApiOperation({ summary: 'List topics by category' })
  findAllByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.topicsService.findAllByCategory(categoryId);
  }

  @ApiTags('topics')
  @Get('topics/:id')
  @ApiOperation({ summary: 'Get topic by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.topicsService.findOne(id);
  }

  @ApiTags('topics')
  @Patch('topics/:id')
  @ApiOperation({ summary: 'Update topic' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTopicDto: UpdateTopicDto,
  ) {
    return this.topicsService.update(id, updateTopicDto);
  }

  @ApiTags('topics')
  @Delete('topics/:id')
  @ApiOperation({ summary: 'Delete topic' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.topicsService.remove(id);
  }
}
