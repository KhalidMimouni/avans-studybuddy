import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @Get()
  findAll(
    @Query('studyYear') studyYear?: string,
    @Query('semester') semester?: string,
    @Query('search') search?: string,
  ) {
    return this.service.findAll({
      studyYear: studyYear ? +studyYear : undefined,
      semester: semester ? +semester : undefined,
      search,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
