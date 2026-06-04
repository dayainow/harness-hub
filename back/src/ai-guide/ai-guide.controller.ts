import { Controller, Post, Param, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiGuideService } from './ai-guide.service';

@ApiTags('ai-guide')
@Controller('ai-guide')
export class AiGuideController {
  constructor(private readonly aiGuideService: AiGuideService) {}

  @Post('generate/:harnessId')
  @ApiOperation({
    summary: 'Generate and save the AI guide for a single harness (sync)',
  })
  async generateOne(@Param('harnessId') harnessId: string) {
    await this.aiGuideService.generateAndSave(harnessId);
    return { success: true, harnessId };
  }

  @Post('generate-all')
  @HttpCode(202)
  @ApiOperation({
    summary:
      'Trigger AI guide generation for all ACTIVE harnesses without a guide (async)',
  })
  generateAll() {
    // Fire-and-forget so the request returns immediately.
    void this.aiGuideService.generateAllActive();
    return { message: 'AI guide generation triggered for active harnesses' };
  }
}
