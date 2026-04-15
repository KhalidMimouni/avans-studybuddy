import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyGroup } from '../entities';
import { CreateStudyGroupDto } from './dto/create-study-group.dto';
import { UpdateStudyGroupDto } from './dto/update-study-group.dto';

@Injectable()
export class StudyGroupsService {
  constructor(
    @InjectRepository(StudyGroup) private repo: Repository<StudyGroup>,
  ) {}

  findAll(filters?: { courseId?: number; search?: string }) {
    const qb = this.repo
      .createQueryBuilder('sg')
      .leftJoinAndSelect('sg.course', 'course')
      .leftJoinAndSelect('sg.owner', 'owner');

    if (filters?.courseId) {
      qb.andWhere('sg.courseId = :courseId', { courseId: filters.courseId });
    }
    if (filters?.search) {
      qb.andWhere(
        '(sg.title LIKE :s OR sg.meetingLocation LIKE :s)',
        { s: `%${filters.search}%` },
      );
    }

    return qb.orderBy('sg.createdAt', 'DESC').getMany();
  }

  async findOne(id: number) {
    const group = await this.repo.findOne({
      where: { id },
      relations: ['course', 'owner', 'studySessions'],
    });
    if (!group) throw new NotFoundException('Study group not found');
    return group;
  }

  create(dto: CreateStudyGroupDto, userId: number) {
    const group = this.repo.create({ ...dto, ownerId: userId });
    return this.repo.save(group);
  }

  async update(id: number, dto: UpdateStudyGroupDto, userId: number) {
    const group = await this.findOneAndVerifyOwner(id, userId);
    Object.assign(group, dto);
    return this.repo.save(group);
  }

  async remove(id: number, userId: number) {
    await this.findOneAndVerifyOwner(id, userId);
    await this.repo.delete(id);
  }

  private async findOneAndVerifyOwner(id: number, userId: number) {
    const group = await this.repo.findOne({ where: { id } });
    if (!group) throw new NotFoundException('Study group not found');
    if (group.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can modify this study group');
    }
    return group;
  }
}
