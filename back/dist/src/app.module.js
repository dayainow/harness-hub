"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const cache_manager_1 = require("@nestjs/cache-manager");
const nestjs_pino_1 = require("nestjs-pino");
const transform_interceptor_1 = require("./common/transform.interceptor");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const benchmarks_module_1 = require("./benchmarks/benchmarks.module");
const collections_module_1 = require("./collections/collections.module");
const harnesses_module_1 = require("./harnesses/harnesses.module");
const prisma_module_1 = require("./prisma/prisma.module");
const reviews_module_1 = require("./reviews/reviews.module");
const search_module_1 = require("./search/search.module");
const users_module_1 = require("./users/users.module");
const schedule_1 = require("@nestjs/schedule");
const crawler_module_1 = require("./crawler/crawler.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
            crawler_module_1.CrawlerModule,
            cache_manager_1.CacheModule.register({
                isGlobal: true,
                ttl: 300000,
            }),
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    transport: process.env.NODE_ENV !== 'production'
                        ? { target: 'pino-pretty', options: { colorize: true } }
                        : undefined,
                },
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'default',
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            prisma_module_1.PrismaModule,
            harnesses_module_1.HarnessesModule,
            benchmarks_module_1.BenchmarksModule,
            reviews_module_1.ReviewsModule,
            collections_module_1.CollectionsModule,
            search_module_1.SearchModule,
            users_module_1.UsersModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_interceptor_1.TransformInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map