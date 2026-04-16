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
import { StudySessionsService } from './study-sessions.service';
import { CreateStudySessionDto } from './dto/create-study-session.dto';
import { UpdateStudySessionDto } from './dto/update-study-session.dto';

@Controller('study-sessions')
export class StudySessionsController {
  constructor(private readonly service: StudySessionsService) {}

  @Get()
  findAll(
    @Query('studyGroupId') studyGroupId?: string,
    @Query('courseId') courseId?: string,
    @Query('date') date?: string,
    @Query('search') search?: string,
  ) {
    return this.service.findAll({
      studyGroupId: studyGroupId ? +studyGroupId : undefined,
      courseId: courseId ? +courseId : undefined,
      date,
      search,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreateStudySessionDto,
    @Request() req: { user: { id: number } },
  ) {
    return this.service.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStudySessionDto,
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
