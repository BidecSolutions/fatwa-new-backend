import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FatwaAnswer } from './entity/fatwa-answer.entity';
import { Fatwa } from 'src/fatwa-queries/entity/fatwa-queries.entity';
import { fatwa_student_assignments } from 'src/fatwa-student-assignments/entity/fatwa-student-assignment.entity';

@Injectable()
export class FatwaAnswersService {
  constructor(
    @InjectRepository(FatwaAnswer)
    private readonly answerRepo: Repository<FatwaAnswer>,

    @InjectRepository(fatwa_student_assignments)
    private readonly assignmentRepo: Repository<fatwa_student_assignments>,

    @InjectRepository(Fatwa)
    private readonly fatwaRepo: Repository<Fatwa>,
  ) { }

  // ✅ Create Answer (only assigned student)
  async create(fatwaId: number, studentId: number, content: string) {
    const fatwa = await this.fatwaRepo.findOne({ where: { id: fatwaId } });
    if (!fatwa) throw new NotFoundException(`Fatwa #${fatwaId} not found`);

    const existingAnswer = await this.answerRepo.findOne({
      where: { fatwa_id: fatwaId, student_id: studentId },
    });
    if (existingAnswer) {
      throw new ForbiddenException(`You have already submitted an answer for this fatwa`);
    }
    

    const answer = this.answerRepo.create({
      fatwa_id: fatwaId,
      student_id: studentId,
      content,
    });

    const savedAnswer = await this.answerRepo.save(answer);
    return {
      success: true,
      message: 'Answer created successfully',
      data: savedAnswer,
    };
  }

  async findAll(fatwaId?: number) {
    const answers = fatwaId
      ? await this.answerRepo.find({ where: { fatwa_id: fatwaId }, relations: ['fatwa'] })
      : await this.answerRepo.find({ relations: ['fatwa'] });

    return {
      success: true,
      message: answers.length ? 'Answers fetched successfully' : 'No answers found',
      data: answers,
    };
  }

  async findOne(id: number) {
    const answer = await this.answerRepo.findOne({ where: { id }, relations: ['fatwa'] });
    if (!answer) throw new NotFoundException(`Answer #${id} not found`);

    return {
      success: true,
      message: 'Answer fetched successfully',
      data: answer,
    };
  }


  async update(id: number, studentId: number, content: string) {
    const answer = await this.answerRepo.findOne({ where: { id } });
    if (!answer) throw new NotFoundException(`Answer #${id} not found`);

    if (answer.student_id !== studentId) {
      throw new ForbiddenException(`You are not allowed to update this answer`);
    }

    const assignment = await this.assignmentRepo.findOne({
      where: { fatwa_query_id: answer.fatwa_id, user_id: studentId }, // ✅ fixed
    });
    if (!assignment) {
      throw new ForbiddenException(`You are not assigned to this fatwa`);
    }

    answer.content = content;
    const updatedAnswer = await this.answerRepo.save(answer);

    return {
      success: true,
      message: 'Answer updated successfully',
      data: updatedAnswer,
    };
  }

  async remove(id: number, studentId: number) {
    const answer = await this.answerRepo.findOne({ where: { id } });
    if (!answer) throw new NotFoundException(`Answer #${id} not found`);

    if (answer.student_id !== studentId) {
      throw new ForbiddenException(`You are not allowed to delete this answer`);
    }

    const assignment = await this.assignmentRepo.findOne({
      where: { fatwa_query_id: answer.fatwa_id, user_id: studentId }, // ✅ fixed
    });
    if (!assignment) {
      throw new ForbiddenException(`You are not assigned to this fatwa`);
    }

    await this.answerRepo.remove(answer);
    return {
      success: true,
      message: 'Answer deleted successfully',
    };
  }
}