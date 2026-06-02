import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { PrismaExceptionFilter } from './common/prisma-exception.filter';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  // Graceful shutdown hooks (SIGTERM, SIGINT)
  app.enableShutdownHooks();

  app.enableCors({
    // Frontend origins allowed to call this API.
    //   - localhost:3000/3001 → Next.js dev server
    //   - olalab.kr (+ subdomains) → legacy Ola domain
    //   - harness-*.vercel.app → HarnessHub frontend preview/prod deploys
    //   - *.onrender.com → backend self-origin (Swagger, etc.)
    // Add new production hostnames here as deployments expand.
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://olalab.kr',
      /\.olalab\.kr$/,
      /^https:\/\/harness-.*\.vercel\.app$/,
      /^https:\/\/clientfront.*\.vercel\.app$/,
      /^https:\/\/.*\.onrender\.com$/,
      'https://harnesshub.kr',
      'https://www.harnesshub.kr',
    ],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  // 입력값 검증 파이프라인
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // 예외 필터: 순서 중요 — 일반 필터 먼저, Prisma 필터를 나중에 등록하면
  // Prisma 에러가 먼저 매칭됩니다 (NestJS는 역순으로 필터를 적용)
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new PrismaExceptionFilter(),
  );

  const config = new DocumentBuilder()
    .setTitle('HarnessHub API')
    .setDescription(
      'The core API documentation for the HarnessHub AI agent harness marketplace.',
    )
    .setVersion('1.0')
    .addTag('harnesses')
    .addTag('benchmarks')
    .addTag('reviews')
    .addTag('collections')
    .addTag('search')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port);
  app.get(Logger).log(`🚀 Server is running on: http://localhost:${port}`);
}

bootstrap();

