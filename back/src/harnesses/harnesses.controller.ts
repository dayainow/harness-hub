import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../common/admin.guard';
import { CreateHarnessDto } from './dto/create-harness.dto';
import { QueryHarnessesDto } from './dto/query-harnesses.dto';
import { SubmitHarnessDto } from './dto/submit-harness.dto';
import { HarnessesService } from './harnesses.service';

@ApiTags('harnesses')
@Controller('harnesses')
export class HarnessesController {
  constructor(private readonly harnessesService: HarnessesService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'List harnesses with filters and pagination' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'modelCompat', required: false })
  @ApiQuery({ name: 'languages', required: false })
  @ApiQuery({ name: 'licenseTier', required: false })
  @ApiQuery({ name: 'verified', required: false })
  @ApiQuery({ name: 'featured', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: QueryHarnessesDto) {
    return this.harnessesService.findAll(query);
  }

  @Get('featured')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'List featured harnesses (curated)' })
  findFeatured() {
    return this.harnessesService.findFeatured();
  }

  @Get('stats')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get aggregate stats for harnesses and benchmarks' })
  getStats() {
    return this.harnessesService.getStats();
  }

  @Post('submit')
  @ApiOperation({
    summary:
      'Submit a harness for review (auth optional). Creates a PENDING record.',
  })
  submit(@Body() dto: SubmitHarnessDto) {
    return this.harnessesService.submitHarness(dto);
  }

  // The slug is "org/name" so we use a wildcard segment.
  // NestJS supports `:param(.*)` regex matchers on Express adapter.
  @Get(':org/:name')
  @ApiOperation({ summary: 'Get a single harness by org/name slug' })
  @ApiParam({ name: 'org', example: 'princeton-nlp' })
  @ApiParam({ name: 'name', example: 'SWE-agent' })
  findBySlug(@Param('org') org: string, @Param('name') name: string) {
    return this.harnessesService.findBySlug(`${org}/${name}`);
  }

  @UseGuards(AdminGuard)
  @Post()
  @ApiOperation({ summary: '[Admin] Create a harness' })
  create(@Body() dto: CreateHarnessDto) {
    return this.harnessesService.create(dto);
  }

  // One-shot admin endpoint that mirrors prisma/update-descriptions.ts so
  // operators can refresh curator-authored copy on Railway without shelling
  // into the container. Intentionally unauthenticated for the initial sync;
  // delete this route once the values are stable in production.
  @Post('admin/sync-descriptions')
  @ApiOperation({
    summary:
      '[Admin / temporary] Sync description + readmeExcerpt from prisma/seed.ts data',
  })
  syncDescriptions() {
    return this.harnessesService.syncDescriptions();
  }
}
