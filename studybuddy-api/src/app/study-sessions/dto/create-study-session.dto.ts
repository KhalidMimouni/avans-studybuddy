import { IsDateString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStudySessionDto {
  @IsNotEmpty()
  title: string;

  @IsDateString()
  sessionDate: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsOptional()
  @IsNotEmpty()
  status?: string;

  @IsOptional()
  notes?: string;

  @IsInt()
  studyGroupId: number;
}
