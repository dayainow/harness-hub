import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiGuideService } from './ai-guide.service';
import { AiGuideController } from './ai-guide.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [AiGuideService],
  controllers: [AiGuideController],
  exports: [AiGuideService],
})
export class AiGuideModule {}
