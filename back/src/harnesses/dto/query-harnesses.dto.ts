import { Type } from 'class-transformer';
import {
  IsBooleanString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  Matches,
} from 'class-validator';

export enum HarnessCategoryEnum {
  CODING_AGENT = 'CODING_AGENT',
  EVAL_HARNESS = 'EVAL_HARNESS',
  RAG_FRAMEWORK = 'RAG_FRAMEWORK',
  RESEARCH_AGENT = 'RESEARCH_AGENT',
  TOOL_USE = 'TOOL_USE',
  MULTI_AGENT = 'MULTI_AGENT',
  BROWSER_AGENT = 'BROWSER_AGENT',
  DATA_PIPELINE = 'DATA_PIPELINE',
  OTHER = 'OTHER',
}

export enum LicenseTierEnum {
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  RED = 'RED',
}

export enum HarnessSortEnum {
  STARS = 'stars',
  DOWNLOADS = 'downloads',
  RECENT = 'recent',
  NAME = 'name',
}

export class QueryHarnessesDto {
  /** Single category or comma-separated list, e.g. "CODING_AGENT,RAG_FRAMEWORK" */
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z_]+(,[A-Z_]+)*$/, { message: 'category must be comma-separated enum values' })
  category?: string;

  /** Comma-separated model IDs, e.g. "claude-sonnet-4-6,gpt-4o" — or a single value. */
  @IsOptional()
  @IsString()
  modelCompat?: string;

  /** Comma-separated languages, e.g. "python,typescript" — or a single value. */
  @IsOptional()
  @IsString()
  languages?: string;

  @IsOptional()
  @IsEnum(LicenseTierEnum)
  licenseTier?: LicenseTierEnum;

  @IsOptional()
  @IsBooleanString()
  verified?: string;

  @IsOptional()
  @IsBooleanString()
  featured?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(HarnessSortEnum)
  sort?: HarnessSortEnum;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
