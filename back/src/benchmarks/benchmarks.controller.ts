import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../common/admin.guard';
import { BenchmarksService } from './benchmarks.service';
import {
  CreateBenchmarkDto,
  QueryBenchmarksDto,
} from './dto/create-benchmark.dto';

@ApiTags('benchmarks')
@Controller()
export class BenchmarksController {
  constructor(private readonly benchmarksService: BenchmarksService) {}

  @Get('benchmarks')
  @ApiOperation({ summary: 'List benchmark scores across all harnesses' })
  findAll(@Query() query: QueryBenchmarksDto) {
    return this.benchmarksService.findAll(query);
  }

  @Get('harnesses/:org/:name/benchmarks')
  @ApiOperation({ summary: 'Get benchmark scores for one harness (org/name)' })
  findByHarness(@Param('org') org: string, @Param('name') name: string) {
    return this.benchmarksService.findByHarnessSlug(`${org}/${name}`);
  }

  @UseGuards(AdminGuard)
  @Post('harnesses/:org/:name/benchmarks')
  @ApiOperation({ summary: '[Admin] Add a benchmark score to a harness' })
  create(
    @Param('org') org: string,
    @Param('name') name: string,
    @Body() dto: CreateBenchmarkDto,
  ) {
    return this.benchmarksService.createForSlug(`${org}/${name}`, dto);
  }
}
