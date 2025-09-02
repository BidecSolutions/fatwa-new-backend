// src/fatwa-answer/dto/fatwa-answer.dto.ts

import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFatwaAnswerDto {
  @IsInt()
  fatwa_id: number;

  // ✅ No need to send student_id from client (we get it from logged-in user)
  // So we remove student_id from here

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class UpdateFatwaAnswerDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
