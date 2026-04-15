import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@UseGuards(JwtAuthGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly service: EnrollmentsService) {}

  @Get('my')
  findMine(@Request() req: { user: { id: number } }) {
    return this.service.findByUser(req.user.id);
  }

  @Post()
  enroll(
    @Body() dto: CreateEnrollmentDto,
    @Request() req: { user: { id: number } },
  ) {
    return this.service.enroll(dto, req.user.id);
  }

  @Delete(':studySessionId')
  unenroll(
    @Param('studySessionId', ParseIntPipe) studySessionId: number,
    @Request() req: { user: { id: number } },
  ) {
    return this.service.unenroll(studySessionId, req.user.id);
  }
}
