import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * AdminGuard
 *
 * X-Admin-Secret 헤더 값을 process.env.ADMIN_SECRET 과 비교하여
 * 관리자 전용 엔드포인트 접근을 제한한다.
 *
 * - 헤더 값이 없거나 일치하지 않으면 403 ForbiddenException
 * - ADMIN_SECRET 환경변수가 미설정이면 경고 로그 후 403 (fail-closed)
 *
 * 사용 예:
 *   @UseGuards(AdminGuard)
 *   @Get('pending')
 *   findPending() { ... }
 */
@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const provided =
      (request.headers['x-admin-secret'] as string | undefined) ??
      (request.headers['X-Admin-Secret'] as unknown as string | undefined);

    const expected = process.env.ADMIN_SECRET;

    if (!expected || expected.trim().length === 0) {
      this.logger.warn(
        'ADMIN_SECRET is not configured. Denying admin request by default (fail-closed).',
      );
      throw new ForbiddenException('Admin access is not configured.');
    }

    if (!provided || provided !== expected) {
      throw new ForbiddenException('Invalid or missing admin credentials.');
    }

    return true;
  }
}
