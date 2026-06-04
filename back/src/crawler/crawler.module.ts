import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AiGuideModule } from '../ai-guide/ai-guide.module';

@Module({
  imports: [PrismaModule, AiGuideModule],
  providers: [CrawlerService],
  controllers: [CrawlerController],
  exports: [CrawlerService],
})
export class CrawlerModule {}
