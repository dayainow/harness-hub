import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaService } from '../prisma/prisma.service';
import { Harness } from '@prisma/client';

const AI_GUIDE_MODEL = 'claude-haiku-4-5-20251001';
const README_MAX_CHARS = 3000;
const INTER_HARNESS_DELAY_MS = 1000;

/**
 * System prompt is kept byte-stable so it can be cached across every harness
 * request (prefix-match prompt caching). All per-harness content goes in the
 * user turn after the cached prefix.
 */
const SYSTEM_PROMPT = `당신은 AI 하네스(에이전트 도구)를 분석하여 한국어 사용 가이드를 생성하는 전문가입니다.
주어진 README를 분석하여 아래 JSON 구조를 정확히 따르는 한국어 가이드를 작성하세요.

반드시 다음 JSON 스키마만 출력하세요. 마크다운 코드블록(\`\`\`), 설명, 그 외 어떤 텍스트도 포함하지 마세요. 순수 JSON만 반환합니다.

{
  "summary": "한 줄 핵심 설명",
  "purpose": "어떤 목적으로 사용하는가",
  "howToUse": "어떻게 사용하는가 (설치~실행 흐름)",
  "pros": ["장점1", "장점2", "장점3"],
  "cons": ["단점/한계1", "단점/한계2"],
  "useCases": ["이럴 때 써라1", "이럴 때 써라2", "이럴 때 써라3"]
}`;

@Injectable()
export class AiGuideService {
  private readonly logger = new Logger(AiGuideService.name);
  private client: Anthropic | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private getClient(): Anthropic | null {
    if (this.client) {
      return this.client;
    }
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
    if (!apiKey) {
      this.logger.warn(
        'ANTHROPIC_API_KEY is missing. AI guide generation is disabled.',
      );
      return null;
    }
    this.client = new Anthropic({ apiKey });
    return this.client;
  }

  /**
   * Generate an AI guide JSON string from a harness README.
   * Returns null on any failure (never throws).
   */
  async generateGuide(
    harness: Harness,
    fullReadme: string,
  ): Promise<string | null> {
    const client = this.getClient();
    if (!client) {
      return null;
    }

    const readme = (fullReadme || '').slice(0, README_MAX_CHARS);
    if (!readme.trim()) {
      this.logger.warn(`Empty README for ${harness.slug}; skipping AI guide.`);
      return null;
    }

    try {
      const response = await client.messages.create({
        model: AI_GUIDE_MODEL,
        max_tokens: 2048,
        system: [
          {
            type: 'text',
            text: SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [
          {
            role: 'user',
            content: `하네스 이름: ${harness.name}\n조직: ${harness.orgName}\n설명: ${harness.description}\n\n--- README ---\n${readme}`,
          },
        ],
      });

      const text = response.content
        .filter((block) => block.type === 'text')
        .map((block) => (block as { text: string }).text)
        .join('')
        .trim();

      const guide = this.parseGuideJson(text);
      if (!guide) {
        this.logger.warn(
          `Failed to parse AI guide JSON for ${harness.slug}.`,
        );
        return null;
      }
      return guide;
    } catch (e) {
      this.logger.warn(
        `AI guide API call failed for ${harness.slug}: ${
          e instanceof Error ? e.message : String(e)
        }`,
      );
      return null;
    }
  }

  /**
   * Extract and validate the JSON guide from model output.
   * Returns the normalized JSON string, or null if it can't be parsed.
   */
  private parseGuideJson(text: string): string | null {
    if (!text) {
      return null;
    }
    // Strip any accidental markdown fences.
    let candidate = text.trim();
    const fenceMatch = candidate.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (fenceMatch) {
      candidate = fenceMatch[1].trim();
    } else {
      // Fall back to the first {...} block.
      const start = candidate.indexOf('{');
      const end = candidate.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        candidate = candidate.slice(start, end + 1);
      }
    }

    try {
      const parsed = JSON.parse(candidate);
      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        typeof parsed.summary !== 'string'
      ) {
        return null;
      }
      return JSON.stringify(parsed);
    } catch {
      return null;
    }
  }

  /**
   * Fetch the full README from GitHub, generate a guide, and persist it.
   */
  async generateAndSave(harnessId: string): Promise<void> {
    const harness = await this.prisma.harness.findUnique({
      where: { id: harnessId },
    });
    if (!harness) {
      throw new Error(`Harness with ID ${harnessId} not found`);
    }

    const fullReadme = await this.fetchReadme(harness);
    if (!fullReadme) {
      this.logger.warn(
        `Could not fetch README for ${harness.slug}; skipping AI guide.`,
      );
      return;
    }

    const guide = await this.generateGuide(harness, fullReadme);
    if (!guide) {
      return;
    }

    await this.prisma.harness.update({
      where: { id: harness.id },
      data: { aiGuide: guide, aiGuideGeneratedAt: new Date() },
    });
    this.logger.log(`AI guide generated and saved for ${harness.slug}.`);
  }

  /**
   * Generate AI guides for all ACTIVE harnesses that don't have one yet.
   * Processes sequentially with a delay between calls to respect rate limits.
   * Errors on individual harnesses are logged and skipped.
   */
  async generateAllActive(): Promise<void> {
    const harnesses = await this.prisma.harness.findMany({
      where: { status: 'ACTIVE', aiGuide: null },
      select: { id: true, slug: true },
    });

    this.logger.log(
      `Generating AI guides for ${harnesses.length} harnesses.`,
    );

    for (const harness of harnesses) {
      try {
        await this.generateAndSave(harness.id);
      } catch (e) {
        this.logger.error(
          `Failed to generate AI guide for ${harness.slug}: ${
            e instanceof Error ? e.message : String(e)
          }`,
        );
      }
      await this.delay(INTER_HARNESS_DELAY_MS);
    }

    this.logger.log('Finished generating AI guides for active harnesses.');
  }

  /**
   * Fetch the full README text from GitHub (mirrors crawler fetch pattern).
   */
  private async fetchReadme(harness: Harness): Promise<string | null> {
    const match = harness.repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      this.logger.warn(
        `Invalid GitHub URL for harness ${harness.id}: ${harness.repoUrl}`,
      );
      return null;
    }
    const owner = match[1];
    const repo = match[2].replace('.git', '');

    const token = this.configService.get<string>('GITHUB_TOKEN');
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'HarnessHub-AiGuide',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const readmeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      { headers },
    );
    if (!readmeResponse.ok) {
      this.logger.warn(
        `GitHub README fetch returned ${readmeResponse.status} for ${owner}/${repo}.`,
      );
      return null;
    }
    const readmeData = await readmeResponse.json();
    if (!readmeData.content) {
      return null;
    }
    return Buffer.from(readmeData.content, 'base64').toString('utf-8');
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
