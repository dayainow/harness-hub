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
exports.HarnessesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_guard_1 = require("../common/admin.guard");
const create_harness_dto_1 = require("./dto/create-harness.dto");
const query_harnesses_dto_1 = require("./dto/query-harnesses.dto");
const submit_harness_dto_1 = require("./dto/submit-harness.dto");
const harnesses_service_1 = require("./harnesses.service");
let HarnessesController = class HarnessesController {
    harnessesService;
    constructor(harnessesService) {
        this.harnessesService = harnessesService;
    }
    findAll(query) {
        return this.harnessesService.findAll(query);
    }
    findFeatured() {
        return this.harnessesService.findFeatured();
    }
    getStats() {
        return this.harnessesService.getStats();
    }
    submit(dto) {
        return this.harnessesService.submitHarness(dto);
    }
    findBySlug(org, name) {
        return this.harnessesService.findBySlug(`${org}/${name}`);
    }
    create(dto) {
        return this.harnessesService.create(dto);
    }
};
exports.HarnessesController = HarnessesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List harnesses with filters and pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'modelCompat', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'languages', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'licenseTier', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'verified', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'featured', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'sort', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_harnesses_dto_1.QueryHarnessesDto]),
    __metadata("design:returntype", void 0)
], HarnessesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('featured'),
    (0, swagger_1.ApiOperation)({ summary: 'List featured harnesses (curated)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HarnessesController.prototype, "findFeatured", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get aggregate stats for harnesses and benchmarks' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HarnessesController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)('submit'),
    (0, swagger_1.ApiOperation)({
        summary: 'Submit a harness for review (auth optional). Creates a PENDING record.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [submit_harness_dto_1.SubmitHarnessDto]),
    __metadata("design:returntype", void 0)
], HarnessesController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)(':org/:name'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single harness by org/name slug' }),
    (0, swagger_1.ApiParam)({ name: 'org', example: 'princeton-nlp' }),
    (0, swagger_1.ApiParam)({ name: 'name', example: 'SWE-agent' }),
    __param(0, (0, common_1.Param)('org')),
    __param(1, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HarnessesController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Create a harness' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_harness_dto_1.CreateHarnessDto]),
    __metadata("design:returntype", void 0)
], HarnessesController.prototype, "create", null);
exports.HarnessesController = HarnessesController = __decorate([
    (0, swagger_1.ApiTags)('harnesses'),
    (0, common_1.Controller)('harnesses'),
    __metadata("design:paramtypes", [harnesses_service_1.HarnessesService])
], HarnessesController);
//# sourceMappingURL=harnesses.controller.js.map