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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryHarnessesDto = exports.HarnessSortEnum = exports.LicenseTierEnum = exports.HarnessCategoryEnum = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var HarnessCategoryEnum;
(function (HarnessCategoryEnum) {
    HarnessCategoryEnum["CODING_AGENT"] = "CODING_AGENT";
    HarnessCategoryEnum["EVAL_HARNESS"] = "EVAL_HARNESS";
    HarnessCategoryEnum["RAG_FRAMEWORK"] = "RAG_FRAMEWORK";
    HarnessCategoryEnum["RESEARCH_AGENT"] = "RESEARCH_AGENT";
    HarnessCategoryEnum["TOOL_USE"] = "TOOL_USE";
    HarnessCategoryEnum["MULTI_AGENT"] = "MULTI_AGENT";
    HarnessCategoryEnum["BROWSER_AGENT"] = "BROWSER_AGENT";
    HarnessCategoryEnum["DATA_PIPELINE"] = "DATA_PIPELINE";
    HarnessCategoryEnum["OTHER"] = "OTHER";
})(HarnessCategoryEnum || (exports.HarnessCategoryEnum = HarnessCategoryEnum = {}));
var LicenseTierEnum;
(function (LicenseTierEnum) {
    LicenseTierEnum["GREEN"] = "GREEN";
    LicenseTierEnum["YELLOW"] = "YELLOW";
    LicenseTierEnum["RED"] = "RED";
})(LicenseTierEnum || (exports.LicenseTierEnum = LicenseTierEnum = {}));
var HarnessSortEnum;
(function (HarnessSortEnum) {
    HarnessSortEnum["STARS"] = "stars";
    HarnessSortEnum["DOWNLOADS"] = "downloads";
    HarnessSortEnum["RECENT"] = "recent";
    HarnessSortEnum["NAME"] = "name";
})(HarnessSortEnum || (exports.HarnessSortEnum = HarnessSortEnum = {}));
class QueryHarnessesDto {
    category;
    modelCompat;
    languages;
    licenseTier;
    verified;
    featured;
    search;
    sort;
    page;
    limit;
}
exports.QueryHarnessesDto = QueryHarnessesDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[A-Z_]+(,[A-Z_]+)*$/, { message: 'category must be comma-separated enum values' }),
    __metadata("design:type", String)
], QueryHarnessesDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryHarnessesDto.prototype, "modelCompat", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryHarnessesDto.prototype, "languages", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(LicenseTierEnum),
    __metadata("design:type", String)
], QueryHarnessesDto.prototype, "licenseTier", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBooleanString)(),
    __metadata("design:type", String)
], QueryHarnessesDto.prototype, "verified", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBooleanString)(),
    __metadata("design:type", String)
], QueryHarnessesDto.prototype, "featured", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryHarnessesDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(HarnessSortEnum),
    __metadata("design:type", String)
], QueryHarnessesDto.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QueryHarnessesDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], QueryHarnessesDto.prototype, "limit", void 0);
//# sourceMappingURL=query-harnesses.dto.js.map