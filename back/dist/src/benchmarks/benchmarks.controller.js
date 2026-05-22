"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BenchmarksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_guard_1 = require("../common/admin.guard");
const benchmarks_service_1 = require("./benchmarks.service");
const create_benchmark_dto_1 = require("./dto/create-benchmark.dto");
let BenchmarksController = class BenchmarksController {
    benchmarksService;
    constructor(benchmarksService) {
        this.benchmarksService = benchmarksService;
    }
    findAll(query) {
        return this.benchmarksService.findAll(query);
    }
    findByHarness(org, name) {
        return this.benchmarksService.findByHarnessSlug(`${org}/${name}`);
    }
    create(org, name, dto) {
        return this.benchmarksService.createForSlug(`${org}/${name}`, dto);
    }
};
exports.BenchmarksController = BenchmarksController;
__decorate([
    (0, common_1.Get)('benchmarks'),
    (0, swagger_1.ApiOperation)({ summary: 'List benchmark scores across all harnesses' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_benchmark_dto_1.QueryBenchmarksDto]),
    __metadata("design:returntype", void 0)
], BenchmarksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('harnesses/:org/:name/benchmarks'),
    (0, swagger_1.ApiOperation)({ summary: 'Get benchmark scores for one harness (org/name)' }),
    __param(0, (0, common_1.Param)('org')),
    __param(1, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BenchmarksController.prototype, "findByHarness", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Post)('harnesses/:org/:name/benchmarks'),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Add a benchmark score to a harness' }),
    __param(0, (0, common_1.Param)('org')),
    __param(1, (0, common_1.Param)('name')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_benchmark_dto_1.CreateBenchmarkDto]),
    __metadata("design:returntype", void 0)
], BenchmarksController.prototype, "create", null);
exports.BenchmarksController = BenchmarksController = __decorate([
    (0, swagger_1.ApiTags)('benchmarks'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [benchmarks_service_1.BenchmarksService])
], BenchmarksController);
//# sourceMappingURL=benchmarks.controller.js.map