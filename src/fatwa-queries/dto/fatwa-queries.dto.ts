import { IsString, IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreateFatwaDto {
  @IsString()
  subject: string;

  @IsString()
  question: string;

  @IsOptional()
  @IsString()
  answer?: string;

  @IsOptional()
  @IsBoolean()
  reviewed?: boolean;

  @IsInt()
  categoryId: number;

  @IsInt()
  @IsOptional()
  clientId: number;
}

export class UpdateFatwaDto {
  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsString()
  answer?: string;

  @IsOptional()
  @IsBoolean()
  reviewed?: boolean;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsInt()
  clientId?: number;
}
