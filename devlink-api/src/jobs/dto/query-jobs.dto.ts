import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { JobType, JobStatus } from '@prisma/client';

export class QueryJobsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(JobType)
  type?: JobType;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus = JobStatus.OPEN;
}