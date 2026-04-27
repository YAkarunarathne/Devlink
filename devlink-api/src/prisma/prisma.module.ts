import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService], // services belong to this module 
  exports: [PrismaService],
})
export class PrismaModule {}