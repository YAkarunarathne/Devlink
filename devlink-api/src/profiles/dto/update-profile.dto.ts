import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];

  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @IsOptional()
  @IsUrl()
  websiteUrl?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}