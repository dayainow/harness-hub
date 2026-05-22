"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AdminGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminGuard = void 0;
const common_1 = require("@nestjs/common");
let AdminGuard = AdminGuard_1 = class AdminGuard {
    logger = new common_1.Logger(AdminGuard_1.name);
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const provided = request.headers['x-admin-secret'] ??
            request.headers['X-Admin-Secret'];
        const expected = process.env.ADMIN_SECRET;
        if (!expected || expected.trim().length === 0) {
            this.logger.warn('ADMIN_SECRET is not configured. Denying admin request by default (fail-closed).');
            throw new common_1.ForbiddenException('Admin access is not configured.');
        }
        if (!provided || provided !== expected) {
            throw new common_1.ForbiddenException('Invalid or missing admin credentials.');
        }
        return true;
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = AdminGuard_1 = __decorate([
    (0, common_1.Injectable)()
], AdminGuard);
//# sourceMappingURL=admin.guard.js.map