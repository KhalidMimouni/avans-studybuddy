import { IsInt, IsOptional } from 'class-validator';

export class CreateEnrollmentDto {
  @IsInt()
  studySessionId: number;

  @IsOptional()
  motivation?: string;
}
