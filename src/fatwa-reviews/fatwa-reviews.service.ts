import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FatwaAnswer } from 'src/fatwa-answers/entity/fatwa-answer.entity';
import { User } from 'src/users/entity/user.entity';
import { FatwaStatus, ReviewStatus } from 'src/common/enums/fatwah.enum';
import { FatwaReview } from './entity/fatwa-reviews.entity';
import {
  CreateFatwaReviewDto,
  UpdateFatwaReviewDto,
} from './dto/fatwa-reviews.dto';
import { Fatwa } from 'src/fatwa-queries/entity/fatwa-queries.entity';

@Injectable()
export class FatwaReviewsService {
  constructor(
    @InjectRepository(FatwaReview)
    private readonly reviewRepo: Repository<FatwaReview>,

    @InjectRepository(FatwaAnswer)
    private readonly fatwaAnswerRepo: Repository<FatwaAnswer>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Fatwa)
    private readonly fatwaRepo: Repository<Fatwa>,
  ) {}

  async create(dto: CreateFatwaReviewDto) {
    const fatwaAnswer = await this.fatwaAnswerRepo.findOne({
      where: { id: dto.fatwa_answer_id },
    });
    if (!fatwaAnswer) {
      throw new NotFoundException(
        `Fatwa Answer #${dto.fatwa_answer_id} not found`,
      );
    }

    

    const teacher = await this.userRepo.findOne({
      where: { id: dto.teacher_id },
      relations: ['userRoles', 'userRoles.role'],
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher #${dto.teacher_id} not found`);
    }

    this.ensureTeacherRole(teacher);

    // prevent duplicate review by same teacher
    const existing = await this.reviewRepo.findOne({
      where: {
        fatwa_answer_id: dto.fatwa_answer_id,
        teacher_id: dto.teacher_id,
      },
    });
    if (existing) {
      throw new BadRequestException(
        `Teacher already reviewed this fatwa answer`,
      );
    }

    const review = this.reviewRepo.create({
      ...dto,
      fatwaAnswer,
      teacher,
      action: dto.action ?? ReviewStatus.SUBMITTED,
    });

    const saved = await this.reviewRepo.save(review);

    // after saving, update FatwaAnswer status
    // await this.updateFatwaAnswerStatus(dto.fatwa_answer_id);

  // ✅ update related Fatwa status → ASSIGNED
    if (fatwaAnswer.fatwa_id) {
      const fatwa = await this.fatwaRepo.findOne({
        where: { id: fatwaAnswer.fatwa_id },
      });

      if (!fatwa) {
        throw new NotFoundException(
          `Fatwa query #${fatwaAnswer.fatwa_id} not found`,
        );
      }

      await this.fatwaRepo.update(fatwa.id, {
        status: FatwaStatus.REVIEWED,
      });
    }

    return {
      success: true,
      message: 'Review submitted successfully',
      data: saved,
    };
  }

  /** ✅ List all reviews */
  async findAll() {
    const data = await this.reviewRepo.find({
      relations: ['fatwaAnswer', 'teacher'],
    });
    return {
      success: true,
      message: 'Fatwa reviews fetched successfully',
      data,
    };
  }

  /** ✅ Get one review */
  async findOne(id: number) {
    const review = await this.reviewRepo.findOne({
      where: { id },
      relations: ['fatwaAnswer', 'teacher'],
    });
    if (!review) throw new NotFoundException(`Review #${id} not found`);
    return { success: true, message: 'Review fetched', data: review };
  }

  /** ✅ Update review (teacher only, cannot change reviewer) */
  async update(id: number, dto: UpdateFatwaReviewDto) {
    const review = await this.reviewRepo.findOne({
      where: { id },
      relations: ['teacher'],
    });
    if (!review) throw new NotFoundException(`Review #${id} not found`);

    if (dto.teacher_id && dto.teacher_id !== review.teacher_id) {
      throw new ForbiddenException(
        `You cannot change the reviewer teacher`,
      );
    }

    Object.assign(review, dto);
    const updated = await this.reviewRepo.save(review);

    await this.updateFatwaAnswerStatus(review.fatwa_answer_id);

    return {
      success: true,
      message: 'Review updated successfully',
      data: updated,
    };
  }

  /** ✅ Delete review */
  async remove(id: number) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException(`Review #${id} not found`);

    await this.reviewRepo.delete(id);

    await this.updateFatwaAnswerStatus(review.fatwa_answer_id);

    return {
      success: true,
      message: 'Review deleted successfully',
    };
  }

  /** ✅ Business logic: Decide FatwaAnswer status */
  private async updateFatwaAnswerStatus(fatwaAnswerId: number) {
    const reviews = await this.reviewRepo.find({
      where: { fatwa_answer_id: fatwaAnswerId },
    });

    const approvedCount = reviews.filter(
      (r) => r.action === ReviewStatus.APPROVED,
    ).length;
    const hasRejected = reviews.some(
      (r) => r.action === ReviewStatus.REJECTED,
    );
    const hasEdited = reviews.some((r) => r.action === ReviewStatus.EDITED);

    if (hasRejected) {
      await this.fatwaAnswerRepo.update(fatwaAnswerId, {
        status: ReviewStatus.REJECTED,
      });
      return;
    }

    if (hasEdited) {
      await this.fatwaAnswerRepo.update(fatwaAnswerId, {
        status: ReviewStatus.EDITED,
      });
      return;
    }

    if (approvedCount >= 3) {
      await this.fatwaAnswerRepo.update(fatwaAnswerId, {
        status: ReviewStatus.APPROVED,
      });
      return;
    }

  }

  /** ✅ Ensure only teachers can review */
  private ensureTeacherRole(user: User) {
    const isTeacher = user.userRoles.some(
      (ur) => ur.role?.name?.toLowerCase() === 'teacher',
    );
    if (!isTeacher) {
      throw new BadRequestException(
        'Only teachers are allowed to review fatwa answers',
      );
    }
  }
}
