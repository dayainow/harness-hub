import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateBenchmarkDto {
  @IsString()
  name!: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  score!: number;

  @IsString()
  model!: string;

  @Type(() => Date)
  @IsDate()
  date!: Date;
}

export class QueryBenchmarksDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  model?: string;
}
