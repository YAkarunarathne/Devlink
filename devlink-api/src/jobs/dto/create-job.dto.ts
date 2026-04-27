import {
  IsEnum,
  IsInt,
  IsArray,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { JobType } from '@prisma/client';

export class CreateJobDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsEnum(JobType)
  type!: JobType;

  @IsString()
  location!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMax?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}