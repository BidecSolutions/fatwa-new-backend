// src/fatwa-assignments/dto/fatwa-assignment.dto.ts
import { IsInt, IsOptional, IsEnum } from 'class-validator';
import { AssignmentStatus } from 'src/common/enums/fatwah.enum';

export class CreateFatwaAssignmentDto {
  @IsInt()
  fatwaId: number;   

  @IsInt()
  userId: number;

  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;
}

export class UpdateFatwaAssignmentDto {
  @IsOptional()
  @IsInt()
  fatwaId?: number; 

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;
}
