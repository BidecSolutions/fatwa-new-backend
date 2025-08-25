import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSavedPlaceDto {
  @IsOptional()
  name: string;

  @IsNotEmpty()
  longitude: string;

  @IsNotEmpty()
  latitude: string;

  @IsNotEmpty()
  address: string;

  
}

export class UpdateSavedPlaceDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  longitude?: string;

  @IsOptional()
  latitude?: string;

  @IsOptional()
  address?: string;

  
}
