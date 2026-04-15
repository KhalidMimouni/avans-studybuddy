import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateStudySessionDto {
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsDateString()
  sessionDate?: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsNotEmpty()
  status?: string;

  @IsOptional()
  notes?: string;
}
