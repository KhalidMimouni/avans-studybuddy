import { IsBoolean, IsInt, IsOptional, IsNotEmpty, Min } from 'class-validator';

export class UpdateStudyGroupDto {
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  meetingLocation?: string;

  @IsOptional()
  @IsInt()
  @Min(2)
  maxMembers?: number;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
