import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @ApiTags('topics')
  @Post('topics/:topicId/resources')
  @ApiOperation({ summary: 'Create resource for a topic' })
  create(
    @Param('topicId', ParseIntPipe) topicId: number,
    @Body() createResourceDto: CreateResourceDto,
  ) {
    return this.resourcesService.create(topicId, createResourceDto);
  }

  @ApiTags('topics')
  @Get('topics/:topicId/resources')
  @ApiOperation({ summary: 'List resources by topic' })
  findAllByTopic(@Param('topicId', ParseIntPipe) topicId: number) {
    return this.resourcesService.findAllByTopic(topicId);
  }

  @ApiTags('resources')
  @Get('resources/:id')
  @ApiOperation({ summary: 'Get resource by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.findOne(id);
  }

  @ApiTags('resources')
  @Patch('resources/:id')
  @ApiOperation({ summary: 'Update resource' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    return this.resourcesService.update(id, updateResourceDto);
  }

  @ApiTags('resources')
  @Delete('resources/:id')
  @ApiOperation({ summary: 'Delete resource' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.remove(id);
  }
}
