import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StudyGroupsService } from './study-groups.service';
import { CreateStudyGroupDto } from './dto/create-study-group.dto';
import { UpdateStudyGroupDto } from './dto/update-study-group.dto';

@Controller('study-groups')
export class StudyGroupsController {
  constructor(private readonly service: StudyGroupsService) {}

  @Get()
  findAll(
    @Query('courseId') courseId?: string,
    @Query('studyYear') studyYear?: string,
    @Query('search') search?: string,
  ) {
    return this.service.findAll({
      courseId: courseId ? +courseId : undefined,
      studyYear: studyYear ? +studyYear : undefined,
      search,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMine(@Request() req: { user: { id: number } }) {
    return this.service.findByOwner(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreateStudyGroupDto,
    @Request() req: { user: { id: number } },
  ) {
    return this.service.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStudyGroupDto,
    @Request() req: { user: { id: number } },
  ) {
    return this.service.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { id: number } },
  ) {
    return this.service.remove(id, req.user.id);
  }
}
