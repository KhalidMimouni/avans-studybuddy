import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entities';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private repo: Repository<Course>,
  ) {}

  findAll(filters?: { studyYear?: number; semester?: number; search?: string }) {
    const qb = this.repo.createQueryBuilder('course');

    if (filters?.studyYear) {
      qb.andWhere('course.studyYear = :studyYear', { studyYear: filters.studyYear });
    }
    if (filters?.semester) {
      qb.andWhere('course.semester = :semester', { semester: filters.semester });
    }
    if (filters?.search) {
      qb.andWhere('(course.name LIKE :s OR course.code LIKE :s)', { s: `%${filters.search}%` });
    }

    return qb.orderBy('course.name', 'ASC').getMany();
  }

  async findOne(id: number) {
    const course = await this.repo.findOne({
      where: { id },
      relations: ['studyGroups'],
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }
}
