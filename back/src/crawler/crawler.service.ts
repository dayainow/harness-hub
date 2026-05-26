import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LicenseTier, HarnessStatus } from '@prisma/client';

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private classifyLicense(spdxId: string | null): LicenseTier {
    if (!spdxId || spdxId === 'NOASSERTION') {
      return LicenseTier.RED;
    }
    
    const greenLicenses = ['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', 'Unlicense', 'CC0-1.0', 'MPL-2.0'];
    const yellowLicenses = ['GPL-2.0-only', 'GPL-3.0-only', 'AGPL-3.0-only', 'LGPL-2.1-only', 'LGPL-3.0-only', 'CC-BY-4.0', 'GPL-2.0', 'GPL-3.0', 'AGPL-3.0', 'LGPL-2.1', 'LGPL-3.0'];

    if (greenLicenses.includes(spdxId)) {
      return LicenseTier.GREEN;
    }
    if (yellowLicenses.includes(spdxId)) {
      return LicenseTier.YELLOW;
    }
    return LicenseTier.RED;
  }

  @Cron(CronExpression.EVERY_12_HOURS)
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
      } catch (error) {
        this.logger.error(`Failed to sync harness ${harness.slug}`, error);
      }
    }
    
    this.logger.log('Finished GitHub sync for active harnesses.');
  }

  async syncHarness(harnessId: string) {
    const harness = await this.prisma.harness.findUnique({
      where: { id: harnessId },
    });

    if (!harness) {
      throw new Error(`Harness with ID ${harnessId} not found`);
    }

    const repoUrl = harness.repoUrl;
    // Expected repoUrl format: https://github.com/org/repo
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      this.logger.warn(`Invalid GitHub URL for harness ${harness.id}: ${repoUrl}`);
      return;
    }

    const owner = match[1];
    const repo = match[2].replace('.git', '');

    const token = this.configService.get<string>('GITHUB_TOKEN');
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'HarnessHub-Crawler',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      this.logger.warn('GITHUB_TOKEN is missing. Rate limits will be restricted to 60 requests/hour.');
    }

    // 1. Fetch Repository Metadata
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!repoResponse.ok) {
      throw new Error(`GitHub API returned ${repoResponse.status} for repo metadata: ${repoResponse.statusText}`);
    }
    const repoData = await repoResponse.json();

    // 2. Fetch License
    let spdxId: string | null = null;
    try {
      const licenseResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/license`, { headers });
      if (licenseResponse.ok) {
        const licenseData = await licenseResponse.json();
        spdxId = licenseData.license?.spdx_id || null;
      }
    } catch (e) {
      this.logger.warn(`Could not fetch license for ${owner}/${repo}`);
    }

    const licenseTier = this.classifyLicense(spdxId);
    let updatedStatus = harness.status;
    if (licenseTier === LicenseTier.RED && harness.status === HarnessStatus.ACTIVE) {
      this.logger.warn(`Harness ${harness.slug} assigned RED tier. Moving to PENDING status.`);
      updatedStatus = HarnessStatus.PENDING;
    }

    // 3. Fetch README
    const readmeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
    let readmeExcerpt = harness.readmeExcerpt;
    if (readmeResponse.ok) {
      const readmeData = await readmeResponse.json();
      if (readmeData.content) {
        const decodedReadme = Buffer.from(readmeData.content, 'base64').toString('utf-8');
        // Simple plain text extraction for excerpt (removing markdown)
        const plainText = decodedReadme.replace(/[#*`_\[\]()]/g, '').trim();
        readmeExcerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
      }
    }

    // 4. Update Database
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
}
