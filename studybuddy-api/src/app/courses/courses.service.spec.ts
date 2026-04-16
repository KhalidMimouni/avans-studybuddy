import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from '../entities';

const mockQueryBuilder = {
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue([]),
};

const mockRepo = {
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('CoursesService', () => {
  let service: CoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: getRepositoryToken(Course), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all courses without filters', async () => {
      const courses = [{ id: 1, name: 'Databases' }];
      mockQueryBuilder.getMany.mockResolvedValueOnce(courses);

      const result = await service.findAll();

      expect(mockRepo.createQueryBuilder).toHaveBeenCalledWith('course');
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('course.name', 'ASC');
      expect(result).toEqual(courses);
    });

    it('should apply search filter', async () => {
      await service.findAll({ search: 'Data' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(course.name LIKE :s OR course.code LIKE :s)',
        { s: '%Data%' },
      );
    });

    it('should apply studyYear and semester filters', async () => {
      await service.findAll({ studyYear: 2, semester: 1 });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'course.studyYear = :studyYear',
        { studyYear: 2 },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'course.semester = :semester',
        { semester: 1 },
      );
    });
  });

  describe('findOne', () => {
    it('should return a course by id', async () => {
      const course = { id: 1, name: 'Databases' };
      mockRepo.findOne.mockResolvedValueOnce(course);

      const result = await service.findOne(1);

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['studyGroups'],
      });
      expect(result).toEqual(course);
    });

    it('should throw NotFoundException when course does not exist', async () => {
      mockRepo.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and save a course', async () => {
      const dto = { name: 'Databases', code: 'DB01', description: 'Leer databases', studyYear: 2, semester: 1 };
      const created = { id: 1, ...dto };
      mockRepo.create.mockReturnValueOnce(created);
      mockRepo.save.mockResolvedValueOnce(created);

      const result = await service.create(dto);

      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(mockRepo.save).toHaveBeenCalledWith(created);
      expect(result).toEqual(created);
    });
  });

  describe('update', () => {
    it('should update an existing course', async () => {
      const existing = { id: 1, name: 'Old Name', code: 'OLD' };
      const dto = { name: 'New Name' };
      mockRepo.findOne.mockResolvedValueOnce({ ...existing });
      mockRepo.save.mockImplementation((c) => Promise.resolve(c));

      const result = await service.update(1, dto);

      expect(result.name).toBe('New Name');
    });

    it('should throw NotFoundException for non-existent course', async () => {
      mockRepo.findOne.mockResolvedValueOnce(null);

      await expect(service.update(999, { name: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an existing course', async () => {
      mockRepo.findOne.mockResolvedValueOnce({ id: 1 });

      await service.remove(1);

      expect(mockRepo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException for non-existent course', async () => {
      mockRepo.findOne.mockResolvedValueOnce(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
