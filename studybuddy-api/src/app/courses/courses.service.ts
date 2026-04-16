import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entities';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

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

  create(dto: CreateCourseDto) {
    const course = this.repo.create(dto);
    return this.repo.save(course);
  }

  async update(id: number, dto: UpdateCourseDto) {
    const course = await this.repo.findOne({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    Object.assign(course, dto);
    return this.repo.save(course);
  }

  async remove(id: number) {
    const course = await this.repo.findOne({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    await this.repo.delete(id);
  }
}
