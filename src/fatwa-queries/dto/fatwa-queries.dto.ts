import { IsString, IsInt, IsOptional, IsEnum } from 'class-validator';
import { FatwaStatus } from 'src/common/enums/fatwah.enum';
//import { FatwaStatus } from '../entity/fatwa-queries.entity';

export class CreateFatwaDto {
  @IsString()
  subject: string;

  @IsString()
  question: string;

  @IsInt()
  categoryId: number;

  @IsOptional()
  @IsInt()
  clientId?: number;
}

export class UpdateFatwaDto {
  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsInt()
  clientId?: number;

  @IsOptional()
  @IsEnum(FatwaStatus)
  status?: FatwaStatus;
}
