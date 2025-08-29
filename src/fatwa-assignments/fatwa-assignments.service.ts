// src/fatwa-assignments/fatwa-assignments.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FatwaAssignment } from './entity/fatwa-assignment.entity';
import { Fatwa } from 'src/fatwa-queries/entity/fatwa-queries.entity';
import { User } from 'src/users/entity/user.entity';
import { CreateFatwaAssignmentDto, UpdateFatwaAssignmentDto } from './dto/fatwa-assignment.dto';
import { AssignmentStatus } from 'src/common/enums/fatwah.enum';

@Injectable()
export class FatwaAssignmentsService {
  constructor(
    @InjectRepository(FatwaAssignment)
    private readonly assignmentRepository: Repository<FatwaAssignment>,

    @InjectRepository(Fatwa)
    private readonly fatwaRepository: Repository<Fatwa>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /** Create new assignment */
  async create(dto: CreateFatwaAssignmentDto) {
    try {
      const fatwa = await this.fatwaRepository.findOne({ where: { id: dto.fatwaId } });
      if (!fatwa) throw new NotFoundException(`Fatwa #${dto.fatwaId} not found`);

      const user = await this.userRepository.findOne({ where: { id: dto.userId } });
      if (!user) throw new NotFoundException(`User #${dto.userId} not found`);

      const assignment = this.assignmentRepository.create({
        fatwaQuery: fatwa,
        user,
        status: dto.status ? this.validateStatus(dto.status) : AssignmentStatus.PENDING,
      });

      const saved = await this.assignmentRepository.save(assignment);

      return {
        success: true,
        message: 'Fatwa assignment created successfully',
        data: saved,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  /** Fetch all assignments */
  async findAll() {
    const data = await this.assignmentRepository.find({
      relations: ['fatwaQuery', 'user'],
    });
    return {
      success: true,
      message: 'Fatwa assignments fetched successfully',
      data,
    };
  }

  /** Fetch single assignment */
  async findOne(id: number) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: ['fatwaQuery', 'user'],
    });
    if (!assignment) throw new NotFoundException(`Assignment #${id} not found`);
    return {
      success: true,
      message: 'Fatwa assignment fetched successfully',
      data: assignment,
    };
  }

  /** Update assignment */
  async update(id: number, dto: UpdateFatwaAssignmentDto) {
    const existing = await this.assignmentRepository.findOne({
      where: { id },
      relations: ['fatwaQuery', 'user'],
    });
    if (!existing) throw new NotFoundException(`Assignment #${id} not found`);

    if (dto.fatwaId) {
      const fatwa = await this.fatwaRepository.findOne({ where: { id: dto.fatwaId } });
      if (!fatwa) throw new NotFoundException(`Fatwa #${dto.fatwaId} not found`);
      existing.fatwaQuery = fatwa;
    }

    if (dto.userId) {
      const user = await this.userRepository.findOne({ where: { id: dto.userId } });
      if (!user) throw new NotFoundException(`User #${dto.userId} not found`);
      existing.user = user;
    }

    if (dto.status) {
      existing.status = this.validateStatus(dto.status);
    }

    const updated = await this.assignmentRepository.save(existing);

    return {
      success: true,
      message: 'Fatwa assignment updated successfully',
      data: updated,
    };
  }

  /** Toggle assignment status */
  async toggleStatus(id: number) {
    const existing = await this.assignmentRepository.findOne({ where: { id } });
    if (!existing) throw new NotFoundException(`Assignment #${id} not found`);

    const flow: AssignmentStatus[] = [
      AssignmentStatus.PENDING,
      AssignmentStatus.ASSIGNED,
      AssignmentStatus.SUBMITTED,
      AssignmentStatus.REVIEWED,
      AssignmentStatus.COMPLETED,
    ];

    let currentIndex = flow.indexOf(existing.status);
    if (currentIndex === -1) currentIndex = 0;

    const nextIndex = (currentIndex + 1) % flow.length;
    existing.status = flow[nextIndex];

    const updated = await this.assignmentRepository.save(existing);

    return {
      success: true,
      message: `Assignment status changed to ${updated.status}`,
      data: {
        id: updated.id,
        status: updated.status,
      },
    };
  }

  /** Validate status enum */
  private validateStatus(status: string): AssignmentStatus {
    if (!Object.values(AssignmentStatus).includes(status as AssignmentStatus)) {
      throw new BadRequestException(
        `Invalid status. Allowed values: ${Object.values(AssignmentStatus).join(', ')}`,
      );
    }
    return status as AssignmentStatus;
  }
}
