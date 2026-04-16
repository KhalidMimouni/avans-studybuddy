import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  code?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(4)
  studyYear?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(2)
  semester?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
