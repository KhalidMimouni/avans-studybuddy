import { IsBoolean, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateStudyGroupDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  meetingLocation: string;

  @IsInt()
  @Min(2)
  maxMembers: number;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @IsInt()
  courseId: number;
}
