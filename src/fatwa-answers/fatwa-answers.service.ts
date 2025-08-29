import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FatwaAnswer } from './entity/fatwa-answer.entity';
import { User } from 'src/users/entity/user.entity';
import { Fatwa } from 'src/fatwa-queries/entity/fatwa-queries.entity';
import {
  CreateFatwaAnswerDto,
  UpdateFatwaAnswerDto,
} from './dto/fatwa-answer.dto';

@Injectable()
export class FatwaAnswerService {
  constructor(
    @InjectRepository(FatwaAnswer)
    private readonly answerRepo: Repository<FatwaAnswer>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Fatwa)
    private readonly fatwaRepo: Repository<Fatwa>,
  ) {}

  // ✅ Create Answer (student = logged-in user)
  async create(dto: CreateFatwaAnswerDto, user: User) {
    const fatwa = await this.fatwaRepo.findOne({ where: { id: dto.fatwa_id } });
    if (!fatwa) throw new NotFoundException(`Fatwa #${dto.fatwa_id} not found`);

    const student = await this.userRepo.findOne({ where: { id: user.id } });
    if (!student) throw new NotFoundException(`User #${user.id} not found`);

    const answer = this.answerRepo.create({
      content: dto.content,
      fatwa,
      student,
    });

    const saved = await this.answerRepo.save(answer);

    return {
      success: true,
      message: 'Answer submitted successfully',
      data: saved,
    };
  }

  // ✅ Admin: See all answers for a fatwa
  async findByFatwaForAdmin(fatwaId: number) {
    const fatwa = await this.fatwaRepo.findOne({ where: { id: fatwaId } });
    if (!fatwa) throw new NotFoundException(`Fatwa #${fatwaId} not found`);

    const answers = await this.answerRepo.find({
      where: { fatwa: { id: fatwaId } },
      relations: ['student', 'fatwa'],
    });

    return {
      success: true,
      message: `Answers for Fatwa #${fatwaId}`,
      data: answers,
    };
  }

  // ✅ User: See only their own answers for a fatwa
  async findByFatwaForUser(fatwaId: number, user: User) {
    const fatwa = await this.fatwaRepo.findOne({ where: { id: fatwaId } });
    if (!fatwa) throw new NotFoundException(`Fatwa #${fatwaId} not found`);

    const answers = await this.answerRepo.find({
      where: { fatwa: { id: fatwaId }, student: { id: user.id } },
      relations: ['student', 'fatwa'],
    });

    return {
      success: true,
      message: `Your answers for Fatwa #${fatwaId}`,
      data: answers,
    };
  }

  // ✅ Update (only your own answer)
  async update(id: number, dto: UpdateFatwaAnswerDto, user: User) {
    const answer = await this.answerRepo.findOne({
      where: { id },
      relations: ['student'],
    });

    if (!answer) throw new NotFoundException('Answer not found');
    if (answer.student.id !== user.id) {
      throw new ForbiddenException('You can only update your own answer');
    }

    Object.assign(answer, dto);
    const updated = await this.answerRepo.save(answer);

    return {
      success: true,
      message: 'Answer updated successfully',
      data: updated,
    };
  }

  // ✅ Delete (only your own answer)
  async delete(id: number, user: User) {
    const answer = await this.answerRepo.findOne({
      where: { id },
      relations: ['student'],
    });
    if (!answer) throw new NotFoundException('Answer not found');

    if (answer.student.id !== user.id) {
      throw new ForbiddenException('You can only delete your own answer');
    }

    await this.answerRepo.delete(id);

    return {
      success: true,
      message: 'Answer deleted successfully',
    };
  }
}
