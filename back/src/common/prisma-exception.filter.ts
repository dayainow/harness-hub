import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

/**
 * Prisma 에러를 사람이 읽을 수 있는 HTTP 응답으로 변환합니다.
 * - P2025 (레코드 미발견) → 404
 * - P2002 (유니크 제약 위반) → 409
 * - 기타 → 500 (디테일은 서버 로그로만)
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('PrismaException');

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;

    switch (exception.code) {
      case 'P2025':
        // Record not found
        status = HttpStatus.NOT_FOUND;
        message = '요청한 리소스를 찾을 수 없습니다.';
        break;

      case 'P2002':
        // Unique constraint violation
        status = HttpStatus.CONFLICT;
        message = '이미 존재하는 데이터입니다.';
        break;

      case 'P2003':
        // Foreign key constraint violation
        status = HttpStatus.BAD_REQUEST;
        message = '참조된 데이터가 존재하지 않습니다.';
        break;

      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = '서버 내부 오류가 발생했습니다.';
        break;
    }

    this.logger.warn(
      `Prisma Error ${exception.code}: ${exception.message}`,
    );

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.code,
    });
  }
}
