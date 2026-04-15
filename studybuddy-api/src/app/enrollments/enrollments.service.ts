import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from '../entities';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment) private repo: Repository<Enrollment>,
  ) {}

  findByUser(userId: number) {
    return this.repo.find({
      where: { userId },
      relations: ['studySession', 'studySession.studyGroup'],
      order: { createdAt: 'DESC' },
    });
  }

  async enroll(dto: CreateEnrollmentDto, userId: number) {
    const existing = await this.repo.findOne({
      where: { userId, studySessionId: dto.studySessionId },
    });
    if (existing) throw new ConflictException('Already enrolled in this session');

    const enrollment = this.repo.create({
      userId,
      studySessionId: dto.studySessionId,
      motivation: dto.motivation,
    });
    return this.repo.save(enrollment);
  }

  async unenroll(studySessionId: number, userId: number) {
    const enrollment = await this.repo.findOne({
      where: { userId, studySessionId },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    await this.repo.delete(enrollment.id);
  }
}
