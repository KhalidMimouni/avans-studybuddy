import { IsBoolean, IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  @Max(4)
  studyYear: number;

  @IsInt()
  @Min(1)
  @Max(2)
  semester: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
