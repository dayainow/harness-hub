import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @Matches(/^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/, {
    message:
      'slug must be lowercase alphanumeric with optional hyphens (max 64 chars)',
  })
  slug!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  /** Harness slugs ("org/name") to include in the collection. */
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  harnessSlugs?: string[];
}
