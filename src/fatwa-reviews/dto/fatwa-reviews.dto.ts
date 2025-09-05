import { IsInt, IsEnum, IsOptional, IsString } from 'class-validator';
import { ReviewStatus } from 'src/common/enums/fatwah.enum';

export class CreateFatwaReviewDto {
  @IsInt()
  fatwa_answer_id: number;

  @IsOptional()   // ✅ optional, will be filled from req.user.id
  @IsInt()
  teacher_id?: number;

  @IsEnum(ReviewStatus)
  action: ReviewStatus;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdateFatwaReviewDto {
  @IsOptional()
  @IsInt()
  fatwa_answer_id?: number;

  @IsOptional()   // ✅ optional here too
  @IsInt()
  teacher_id?: number;

  @IsOptional()
  @IsEnum(ReviewStatus)
  action?: ReviewStatus;

  @IsOptional()
  @IsString()
  comment?: string;
}
