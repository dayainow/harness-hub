import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { verifySupabaseJwt } from '../common/supabase-auth.util';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('reviews')
@Controller('harnesses')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':org/:name/reviews')
  @ApiOperation({ summary: 'List reviews + aggregate rating for a harness' })
  findAll(@Param('org') org: string, @Param('name') name: string) {
    return this.reviewsService.findByHarnessSlug(`${org}/${name}`);
  }

  @Post(':org/:name/reviews')
  @ApiOperation({ summary: 'Create or update the current user’s review' })
  async create(
    @Param('org') org: string,
    @Param('name') name: string,
    @Body() dto: CreateReviewDto,
    @Headers('authorization') authorization?: string,
  ) {
    const { email } = await this.extractUser(authorization);
    return this.reviewsService.createForSlug(`${org}/${name}`, email, dto);
  }

  private async extractUser(authorization?: string) {
    if (!authorization?.toLowerCase().startsWith('bearer ')) {
      throw new UnauthorizedException('Missing Bearer token.');
    }
    const token = authorization.slice(7).trim();
    if (!token) throw new UnauthorizedException('Empty Bearer token.');
    return verifySupabaseJwt(token);
  }
}
