// fatwa-category.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsInt, MinLength } from 'class-validator';

export class CreateFatwaCategoryDto {
  @IsString()
  @IsNotEmpty()
  
  name: string;

  // status has a default in the entity (1), so it's optional in create
  @IsOptional()
  @IsInt()
  status?: number;

  @IsNotEmpty()
  @IsInt()
  created_by: number;
}

export class UpdateFatwaCategoryDto {
  @IsOptional()
  @IsString()
  
  name?: string;

  @IsOptional()
  @IsInt()
  status?: number;
}



