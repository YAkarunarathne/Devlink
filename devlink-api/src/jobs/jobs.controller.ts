import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { QueryJobsDto } from './dto/query-jobs.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('jobs')
export class JobsController {
  constructor(private jobs: JobsService) {}

  @Get()
  findAll(@Query() query: QueryJobsDto) {
    return this.jobs.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobs.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateJobDto, @Request() req) {
    return this.jobs.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateJobDto, @Request() req) {
    return this.jobs.update(id, req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  close(@Param('id') id: string, @Request() req) {
    return this.jobs.close(id, req.user.id);
  }
}