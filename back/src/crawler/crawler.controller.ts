import { Controller, Post, Param, HttpCode } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('sync/all')
  @HttpCode(202)
  async syncAll() {
    // Trigger asynchronously so it doesn't block the request
    this.crawlerService.syncAllActiveHarnesses();
    return { message: 'Global sync triggered' };
  }

  @Post('sync/:id')
  async syncOne(@Param('id') id: string) {
    const result = await this.crawlerService.syncHarness(id);
    return result;
  }
}
