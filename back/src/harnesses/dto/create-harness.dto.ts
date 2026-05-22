import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Min,
} from 'class-validator';
import {
  HarnessCategoryEnum,
  LicenseTierEnum,
} from './query-harnesses.dto';

export class CreateHarnessDto {
  /** e.g. "princeton-nlp/SWE-agent" */
  @IsString()
  @Matches(/^[^/\s]+\/[^/\s]+$/, {
    message: 'slug must match "org/name" pattern',
  })
  slug!: string;

  @IsString()
  name!: string;

  @IsString()
  orgName!: string;

  @IsUrl()
  repoUrl!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  readmeExcerpt?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stars?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  forks?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  issuesOpen?: number;

  @IsOptional()
  @IsString()
  latestVersion?: string;

  @IsOptional()
  @IsString()
  license?: string;

  @IsOptional()
  @IsEnum(LicenseTierEnum)
  licenseTier?: LicenseTierEnum;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsEnum(HarnessCategoryEnum)
  category?: HarnessCategoryEnum;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  modelCompat?: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsString()
  installCmd?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  downloadsCount?: number;
}
