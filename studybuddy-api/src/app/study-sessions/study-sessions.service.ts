import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudySession, StudyGroup } from '../entities';
import { CreateStudySessionDto } from './dto/create-study-session.dto';
import { UpdateStudySessionDto } from './dto/update-study-session.dto';

@Injectable()
export class StudySessionsService {
  constructor(
    @InjectRepository(StudySession) private repo: Repository<StudySession>,
    @InjectRepository(StudyGroup) private groupRepo: Repository<StudyGroup>,
  ) {}

  findAll(filters?: { studyGroupId?: number; date?: string; search?: string }) {
    const qb = this.repo
      .createQueryBuilder('ss')
      .leftJoinAndSelect('ss.studyGroup', 'studyGroup');

    if (filters?.studyGroupId) {
      qb.andWhere('ss.studyGroupId = :gid', { gid: filters.studyGroupId });
    }
    if (filters?.date) {
      qb.andWhere('DATE(ss.sessionDate) = DATE(:date)', { date: filters.date });
    }
    if (filters?.search) {
      qb.andWhere('ss.title LIKE :s', { s: `%${filters.search}%` });
    }

    return qb.orderBy('ss.sessionDate', 'ASC').getMany();
  }

  async findOne(id: number) {
    const session = await this.repo.findOne({
      where: { id },
      relations: ['studyGroup', 'studyGroup.owner', 'enrollments', 'enrollments.user'],
    });
    if (!session) throw new NotFoundException('Study session not found');
    return session;
  }

  async create(dto: CreateStudySessionDto, userId: number) {
    await this.verifyGroupOwner(dto.studyGroupId, userId);
    this.validateTimes(dto.startTime, dto.endTime);

    const session = this.repo.create({
      ...dto,
      sessionDate: new Date(dto.sessionDate),
      startTime: new Date(dto.startTime),
      endTime: new Date(dto.endTime),
    });
    return this.repo.save(session);
  }

  async update(id: number, dto: UpdateStudySessionDto, userId: number) {
    const session = await this.repo.findOne({
      where: { id },
      relations: ['studyGroup'],
    });
    if (!session) throw new NotFoundException('Study session not found');
    await this.verifyGroupOwner(session.studyGroupId, userId);

    if (dto.startTime && dto.endTime) {
      this.validateTimes(dto.startTime, dto.endTime);
    }

    if (dto.sessionDate) session.sessionDate = new Date(dto.sessionDate);
    if (dto.startTime) session.startTime = new Date(dto.startTime);
    if (dto.endTime) session.endTime = new Date(dto.endTime);
    if (dto.title) session.title = dto.title;
    if (dto.status) session.status = dto.status;
    if (dto.notes !== undefined) session.notes = dto.notes;

    return this.repo.save(session);
  }

  async remove(id: number, userId: number) {
    const session = await this.repo.findOne({ where: { id } });
    if (!session) throw new NotFoundException('Study session not found');
    await this.verifyGroupOwner(session.studyGroupId, userId);
    await this.repo.delete(id);
  }

  private async verifyGroupOwner(groupId: number, userId: number) {
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Study group not found');
    if (group.ownerId !== userId) {
      throw new ForbiddenException('Only the group owner can manage sessions');
    }
  }

  private validateTimes(start: string, end: string) {
    if (new Date(end) <= new Date(start)) {
      throw new BadRequestException('End time must be after start time');
    }
  }
}
