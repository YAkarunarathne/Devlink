import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { QueryJobsDto } from './dto/query-jobs.dto';
import { JobStatus } from '@prisma/client';

const posterSelect = {
  id: true,
  name: true,
  profile: { select: { avatarUrl: true } },
};

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryJobsDto) {
    const { page = 1, limit = 10, search, type, status = JobStatus.OPEN } = query;
    const skip = (page - 1) * limit;

    const where = {
      status,
      ...(type && { type }),
      ...(search && {
        title: { contains: search, mode: 'insensitive' as const },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.jobListing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { postedBy: { select: { id: true, name: true } } },
      }),
      this.prisma.jobListing.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const job = await this.prisma.jobListing.findUnique({
      where: { id },
      include: { postedBy: { select: posterSelect } },
    });
    if (!job) throw new NotFoundException('Job listing not found');
    return job;
  }

  async create(userId: string, dto: CreateJobDto) {
    return this.prisma.jobListing.create({
      data: { ...dto, postedById: userId },
    });
  }

  async update(id: string, userId: string, dto: UpdateJobDto) {
    const job = await this.prisma.jobListing.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job listing not found');
    if (job.postedById !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.jobListing.update({ where: { id }, data: dto });
  }

  async close(id: string, userId: string) {
    const job = await this.prisma.jobListing.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job listing not found');
    if (job.postedById !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.jobListing.update({
      where: { id },
      data: { status: JobStatus.CLOSED },
    });
  }
}