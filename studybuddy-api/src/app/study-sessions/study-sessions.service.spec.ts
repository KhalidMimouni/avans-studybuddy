import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { StudySessionsService } from './study-sessions.service';
import { StudySession, StudyGroup } from '../entities';

const mockSessionRepo = {
  createQueryBuilder: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const mockGroupRepo = {
  findOne: jest.fn(),
};

describe('StudySessionsService', () => {
  let service: StudySessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudySessionsService,
        { provide: getRepositoryToken(StudySession), useValue: mockSessionRepo },
        { provide: getRepositoryToken(StudyGroup), useValue: mockGroupRepo },
      ],
    }).compile();

    service = module.get<StudySessionsService>(StudySessionsService);
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a session with relations', async () => {
      const session = { id: 1, title: 'SOLID principes' };
      mockSessionRepo.findOne.mockResolvedValueOnce(session);

      const result = await service.findOne(1);

      expect(mockSessionRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['studyGroup', 'studyGroup.owner', 'enrollments', 'enrollments.user'],
      });
      expect(result).toEqual(session);
    });

    it('should throw NotFoundException when session does not exist', async () => {
      mockSessionRepo.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateStr = futureDate.toISOString().split('T')[0];

    const dto = {
      title: 'MongoDB Intro',
      studyGroupId: 1,
      sessionDate: dateStr,
      startTime: `${dateStr}T10:00:00`,
      endTime: `${dateStr}T11:00:00`,
    };

    it('should create a session with status planned', async () => {
      mockGroupRepo.findOne.mockResolvedValueOnce({ id: 1, ownerId: 5 });
      const created = { id: 10, ...dto, status: 'planned' };
      mockSessionRepo.create.mockReturnValueOnce(created);
      mockSessionRepo.save.mockResolvedValueOnce(created);

      const result = await service.create(dto, 5);

      expect(result.status).toBe('planned');
      expect(mockSessionRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'planned' }),
      );
    });

    it('should throw ForbiddenException if user is not group owner', async () => {
      mockGroupRepo.findOne.mockResolvedValueOnce({ id: 1, ownerId: 5 });

      await expect(service.create(dto, 999)).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if endTime is before startTime', async () => {
      mockGroupRepo.findOne.mockResolvedValueOnce({ id: 1, ownerId: 5 });

      const badDto = {
        ...dto,
        startTime: `${dateStr}T14:00:00`,
        endTime: `${dateStr}T10:00:00`,
      };

      await expect(service.create(badDto, 5)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if sessionDate is in the past', async () => {
      mockGroupRepo.findOne.mockResolvedValueOnce({ id: 1, ownerId: 5 });

      const pastDto = {
        ...dto,
        sessionDate: '2020-01-01',
        startTime: '2020-01-01T10:00:00',
        endTime: '2020-01-01T11:00:00',
      };

      await expect(service.create(pastDto, 5)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete an existing session owned by user', async () => {
      mockSessionRepo.findOne.mockResolvedValueOnce({ id: 1, studyGroupId: 2 });
      mockGroupRepo.findOne.mockResolvedValueOnce({ id: 2, ownerId: 5 });

      await service.remove(1, 5);

      expect(mockSessionRepo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException for non-existent session', async () => {
      mockSessionRepo.findOne.mockResolvedValueOnce(null);

      await expect(service.remove(999, 5)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not group owner', async () => {
      mockSessionRepo.findOne.mockResolvedValueOnce({ id: 1, studyGroupId: 2 });
      mockGroupRepo.findOne.mockResolvedValueOnce({ id: 2, ownerId: 5 });

      await expect(service.remove(1, 999)).rejects.toThrow(ForbiddenException);
    });
  });
});
