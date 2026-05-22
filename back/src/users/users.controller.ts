import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import { AdminGuard } from '../common/admin.guard';
import { verifySupabaseJwt } from '../common/supabase-auth.util';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AdminGuard)
  @Get('users')
  @ApiOperation({ summary: '[Admin] List all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AdminGuard)
  @Patch('users/:id/role')
  @ApiOperation({ summary: '[Admin] Update user role' })
  updateRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.updateRole(id, role as 'USER' | 'ADMIN' | 'CURATOR');
  }

  @Get('users/me')
  @ApiOperation({ summary: 'Get the current authenticated user profile' })
  async getMe(@Headers('authorization') authorization?: string) {
    const { email } = await this.extractUser(authorization);
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found in DB');
    return user;
  }

  @Post('users/sync')
  @ApiOperation({
    summary:
      'Upsert the current authenticated Supabase user into the application DB',
  })
  async syncUser(@Headers('authorization') authorization?: string) {
    const { email, sub } = await this.extractUser(authorization);
    const token = authorization!.slice(7).trim();
    // verifySupabaseJwt already validated the signature; here we decode
    // (without verification) only to access user_metadata for display fields.
    const decoded = jwt.decode(token) as
      | (jwt.JwtPayload & {
          user_metadata?: { full_name?: string; avatar_url?: string; name?: string };
        })
      | null;
    const meta = decoded?.user_metadata ?? {};
    return this.usersService.syncUser({
      supabaseId: sub,
      email,
      name: meta.full_name ?? meta.name ?? null,
      avatarUrl: meta.avatar_url ?? null,
    });
  }

  @Patch('users/me/username')
  @ApiOperation({ summary: 'Update the current user’s username' })
  async updateUsername(
    @Headers('authorization') authorization?: string,
    @Body('username') username?: string,
  ) {
    if (!username || typeof username !== 'string') {
      throw new BadRequestException('username is required');
    }
    const { email } = await this.extractUser(authorization);
    const updated = await this.usersService.updateUsername(email, username);
    return { success: true, data: updated };
  }

  @Get('users/me/bookmarks')
  @ApiOperation({ summary: 'List the current user’s bookmarked harnesses' })
  async listBookmarks(@Headers('authorization') authorization?: string) {
    const { email } = await this.extractUser(authorization);
    const items = await this.usersService.listBookmarks(email);
    return { items };
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get a user public profile by id' })
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post('harnesses/:org/:name/bookmark')
  @ApiOperation({
    summary: 'Toggle bookmark for the current user on a harness',
  })
  async toggleBookmark(
    @Param('org') org: string,
    @Param('name') name: string,
    @Headers('authorization') authorization?: string,
  ) {
    const { email } = await this.extractUser(authorization);
    return this.usersService.toggleBookmark(email, `${org}/${name}`);
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
