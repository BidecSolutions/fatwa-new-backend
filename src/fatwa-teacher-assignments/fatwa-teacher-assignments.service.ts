import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FatwaAnswer } from 'src/fatwa-answers/entity/fatwa-answer.entity';
import { User } from 'src/users/entity/user.entity';
import { AssignmentStatus } from 'src/common/enums/fatwah.enum';
import { FatwaTeacherAssignment } from './entity/fatwa-teacher-assignments.entity';
import { CreateFatwaTeacherAssignmentDto, UpdateFatwaTeacherAssignmentDto } from './dto/fatwa-teacher-assignments.dto';

@Injectable()
export class FatwaTeacherAssignmentsService {
  constructor(
    @InjectRepository(FatwaTeacherAssignment)
    private readonly teacherAssignmentRepo: Repository<FatwaTeacherAssignment>,

    @InjectRepository(FatwaAnswer)
    private readonly answerRepo: Repository<FatwaAnswer>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /** Assign a fatwa answer to a teacher */
  async create(dto: CreateFatwaTeacherAssignmentDto) {
    const answer = await this.answerRepo.findOne({ where: { id: dto.fatwaAnswerId } });
    if (!answer) throw new NotFoundException(`Fatwa Answer #${dto.fatwaAnswerId} not found`);

    const teacher = await this.userRepo.findOne({ where: { id: dto.teacherId }, relations: ['userRoles', 'userRoles.role'] });
    if (!teacher) throw new NotFoundException(`Teacher #${dto.teacherId} not found`);

    // Optional: validate that user is a teacher
    const isTeacher = teacher.userRoles.some(ur => ur.role?.name.toLowerCase() === 'teacher');
    if (!isTeacher) throw new BadRequestException('User is not a teacher');

    // Check if this teacher is already assigned
    const existing = await this.teacherAssignmentRepo.findOne({
      where: { fatwa_answer_id: dto.fatwaAnswerId, teacher_id: dto.teacherId }
    });
    if (existing) throw new BadRequestException('This answer is already assigned to this teacher');

    const assignment = this.teacherAssignmentRepo.create({
      fatwaAnswer: answer,
      fatwa_answer_id: answer.id,
      teacher: teacher,
      teacher_id: teacher.id,
      status: dto.status ?? AssignmentStatus.ASSIGNED,
    });

    const saved = await this.teacherAssignmentRepo.save(assignment);

    return {
      success: true,
      message: 'Fatwa answer assigned to teacher successfully',
      data: saved,
    };
  }

  /** List all teacher assignments */
  async findAll() {
    const data = await this.teacherAssignmentRepo.find({ relations: ['fatwaAnswer', 'teacher'] });
    return {
      success: true,
      message: 'Teacher assignments fetched successfully',
      data,
    };
  }

  /** Fetch single teacher assignment */
  async findOne(id: number) {
    const assignment = await this.teacherAssignmentRepo.findOne({ where: { id }, relations: ['fatwaAnswer', 'teacher'] });
    if (!assignment) throw new NotFoundException(`Assignment #${id} not found`);
    return { success: true, message: 'Assignment fetched', data: assignment };
  }

  /** Teacher updates/verifies answer */
  async update(id: number, dto: UpdateFatwaTeacherAssignmentDto) {
    const assignment = await this.teacherAssignmentRepo.findOne({ where: { id }, relations: ['fatwaAnswer', 'teacher'] });
    if (!assignment) throw new NotFoundException(`Assignment #${id} not found`);

    if (dto.status) {
      assignment.status = dto.status;
    }

    if (dto.teacherId) {
      const teacher = await this.userRepo.findOne({ where: { id: dto.teacherId }, relations: ['userRoles', 'userRoles.role'] });
      if (!teacher) throw new NotFoundException(`Teacher #${dto.teacherId} not found`);
      assignment.teacher = teacher;
      assignment.teacher_id = teacher.id;
    }

    const updated = await this.teacherAssignmentRepo.save(assignment);

    return { success: true, message: 'Assignment updated', data: updated };
  }

  /** Toggle assignment status (assigned <-> submitted) */
  async toggleStatus(id: number) {
    const assignment = await this.teacherAssignmentRepo.findOne({ where: { id } });
    if (!assignment) throw new NotFoundException(`Assignment #${id} not found`);

    const flow: AssignmentStatus[] = [AssignmentStatus.ASSIGNED, AssignmentStatus.SUBMITTED];
    const nextIndex = (flow.indexOf(assignment.status) + 1) % flow.length;
    assignment.status = flow[nextIndex];

    const updated = await this.teacherAssignmentRepo.save(assignment);

    return { success: true, message: `Status changed to ${updated.status}`, data: updated };
  }

  /** Check if fatwa answer has been verified by minimum 3 teachers */
  async isVerifiedByMinTeachers(fatwaAnswerId: number, minTeachers = 3): Promise<boolean> {
    const count = await this.teacherAssignmentRepo.count({
      where: { fatwa_answer_id: fatwaAnswerId, status: AssignmentStatus.SUBMITTED }
    });
    return count >= minTeachers;
  }
}

