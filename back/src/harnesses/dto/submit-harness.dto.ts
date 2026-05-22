import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { HarnessCategoryEnum } from './query-harnesses.dto';

export class SubmitHarnessDto {
  @IsUrl()
  repoUrl!: string;

  @IsOptional()
  @IsEnum(HarnessCategoryEnum)
  category?: HarnessCategoryEnum;

  @IsOptional()
  @IsString()
  installCmd?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  modelCompat?: string[];

  // Frontend-provided GitHub metadata
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  orgName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  license?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  stars?: number;
}
