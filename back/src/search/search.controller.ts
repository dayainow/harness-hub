import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Full search across harnesses' })
  search(@Query('q') q: string) {
    return this.searchService.search(q ?? '');
  }

  @Get('suggest')
  @ApiOperation({ summary: 'Lightweight typeahead suggestions for harnesses' })
  suggest(@Query('q') q: string) {
    return this.searchService.suggest(q ?? '');
  }
}
