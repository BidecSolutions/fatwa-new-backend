// src/fatwa-assignments/dto/fatwa-teacher-assignment.dto.ts
import { IsInt, IsOptional, IsEnum } from 'class-validator';
import { AssignmentStatus } from 'src/common/enums/fatwah.enum';

export class CreateFatwaTeacherAssignmentDto {
  @IsInt()
  fatwaAnswerId: number;

  @IsInt()
  teacherId: number;

  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;
}

export class UpdateFatwaTeacherAssignmentDto {
  @IsOptional()
  @IsInt()
  fatwaAnswerId?: number;

  @IsOptional()
  @IsInt()
  teacherId?: number;

  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;
}
