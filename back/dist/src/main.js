"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const prisma_exception_filter_1 = require("./common/prisma-exception.filter");
const all_exceptions_filter_1 = require("./common/all-exceptions.filter");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableShutdownHooks();
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://olalab.kr',
            /\.olalab\.kr$/,
            /^https:\/\/harness-.*\.vercel\.app$/,
            /^https:\/\/.*\.onrender\.com$/,
        ],
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(), new prisma_exception_filter_1.PrismaExceptionFilter());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('HarnessHub API')
        .setDescription('The core API documentation for the HarnessHub AI agent harness marketplace.')
        .setVersion('1.0')
        .addTag('harnesses')
        .addTag('benchmarks')
        .addTag('reviews')
        .addTag('collections')
        .addTag('search')
        .addTag('users')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3002;
    await app.listen(port);
    logger.log(`🚀 Server is running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map