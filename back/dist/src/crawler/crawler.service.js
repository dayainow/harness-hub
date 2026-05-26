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
var CrawlerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CrawlerService = CrawlerService_1 = class CrawlerService {
    prisma;
    configService;
    logger = new common_1.Logger(CrawlerService_1.name);
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    classifyLicense(spdxId) {
        if (!spdxId || spdxId === 'NOASSERTION') {
            return client_1.LicenseTier.RED;
        }
        const greenLicenses = ['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', 'Unlicense', 'CC0-1.0', 'MPL-2.0'];
        const yellowLicenses = ['GPL-2.0-only', 'GPL-3.0-only', 'AGPL-3.0-only', 'LGPL-2.1-only', 'LGPL-3.0-only', 'CC-BY-4.0', 'GPL-2.0', 'GPL-3.0', 'AGPL-3.0', 'LGPL-2.1', 'LGPL-3.0'];
        if (greenLicenses.includes(spdxId)) {
            return client_1.LicenseTier.GREEN;
        }
        if (yellowLicenses.includes(spdxId)) {
            return client_1.LicenseTier.YELLOW;
        }
        return client_1.LicenseTier.RED;
    }
    async handleCron() {
        this.logger.log('Starting scheduled GitHub sync for all ACTIVE harnesses...');
        await this.syncAllActiveHarnesses();
    }
    async syncAllActiveHarnesses() {
        const harnesses = await this.prisma.harness.findMany({
            where: { status: 'ACTIVE' },
        });
        this.logger.log(`Found ${harnesses.length} active harnesses to sync.`);
        for (const harness of harnesses) {
            try {
                await this.syncHarness(harness.id);
            }
            catch (error) {
                this.logger.error(`Failed to sync harness ${harness.slug}`, error);
            }
        }
        this.logger.log('Finished GitHub sync for active harnesses.');
    }
    async syncHarness(harnessId) {
        const harness = await this.prisma.harness.findUnique({
            where: { id: harnessId },
        });
        if (!harness) {
            throw new Error(`Harness with ID ${harnessId} not found`);
        }
        const repoUrl = harness.repoUrl;
        const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!match) {
            this.logger.warn(`Invalid GitHub URL for harness ${harness.id}: ${repoUrl}`);
            return;
        }
        const owner = match[1];
        const repo = match[2].replace('.git', '');
        const token = this.configService.get('GITHUB_TOKEN');
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'HarnessHub-Crawler',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        else {
            this.logger.warn('GITHUB_TOKEN is missing. Rate limits will be restricted to 60 requests/hour.');
        }
        const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
        if (!repoResponse.ok) {
            throw new Error(`GitHub API returned ${repoResponse.status} for repo metadata: ${repoResponse.statusText}`);
        }
        const repoData = await repoResponse.json();
        let spdxId = null;
        try {
            const licenseResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/license`, { headers });
            if (licenseResponse.ok) {
                const licenseData = await licenseResponse.json();
                spdxId = licenseData.license?.spdx_id || null;
            }
        }
        catch (e) {
            this.logger.warn(`Could not fetch license for ${owner}/${repo}`);
        }
        const licenseTier = this.classifyLicense(spdxId);
        let updatedStatus = harness.status;
        if (licenseTier === client_1.LicenseTier.RED && harness.status === client_1.HarnessStatus.ACTIVE) {
            this.logger.warn(`Harness ${harness.slug} assigned RED tier. Moving to PENDING status.`);
            updatedStatus = client_1.HarnessStatus.PENDING;
        }
        const readmeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
        let readmeExcerpt = harness.readmeExcerpt;
        if (readmeResponse.ok) {
            const readmeData = await readmeResponse.json();
            if (readmeData.content) {
                const decodedReadme = Buffer.from(readmeData.content, 'base64').toString('utf-8');
                const plainText = decodedReadme.replace(/[#*`_\[\]()]/g, '').trim();
                readmeExcerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
            }
        }
        await this.prisma.harness.update({
            where: { id: harness.id },
            data: {
                stars: repoData.stargazers_count,
                forks: repoData.forks_count,
                issuesOpen: repoData.open_issues_count,
                readmeExcerpt,
                license: spdxId || harness.license,
                licenseTier,
                status: updatedStatus,
                lastUpdated: new Date(),
            },
        });
        this.logger.log(`Successfully synced ${harness.slug}: ${repoData.stargazers_count} stars`);
        return { success: true, slug: harness.slug, stars: repoData.stargazers_count };
    }
};
exports.CrawlerService = CrawlerService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_12_HOURS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CrawlerService.prototype, "handleCron", null);
exports.CrawlerService = CrawlerService = CrawlerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], CrawlerService);
//# sourceMappingURL=crawler.service.js.map