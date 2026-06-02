import {
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { verifySupabaseJwt } from '../common/supabase-auth.util';
import { BookmarksService } from './bookmarks.service';

@ApiTags('bookmarks')
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post(':harnessId')
  @ApiOperation({ summary: 'Add a bookmark for the current user' })
  async add(
    @Param('harnessId') harnessId: string,
    @Headers('authorization') authorization?: string,
  ) {
    const { email } = await this.extractUser(authorization);
    return this.bookmarksService.add(email, harnessId);
  }

  @Delete(':harnessId')
  @ApiOperation({ summary: 'Remove the current user’s bookmark' })
  async remove(
    @Param('harnessId') harnessId: string,
    @Headers('authorization') authorization?: string,
  ) {
    const { email } = await this.extractUser(authorization);
    return this.bookmarksService.remove(email, harnessId);
  }

  @Get('my')
  @ApiOperation({
    summary: 'List the current user’s bookmarks with harness info',
  })
  async listMine(@Headers('authorization') authorization?: string) {
    const { email } = await this.extractUser(authorization);
    return this.bookmarksService.listMine(email);
  }

  @Get('check/:harnessId')
  @ApiOperation({
    summary: 'Check whether the current user bookmarked a harness',
  })
  async check(
    @Param('harnessId') harnessId: string,
    @Headers('authorization') authorization?: string,
  ) {
    const { email } = await this.extractUser(authorization);
    return this.bookmarksService.check(email, harnessId);
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
