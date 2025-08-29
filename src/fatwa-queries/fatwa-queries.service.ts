import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fatwa } from './entity/fatwa-queries.entity';
import { FatwaStatus } from 'src/common/enums/fatwah.enum';
import { CreateFatwaDto, UpdateFatwaDto } from './dto/fatwa-queries.dto';
import { User } from 'src/users/entity/user.entity';
import { FatwaCategory } from 'src/category/entity/category.entity';

@Injectable()
export class FatwaQueriesService {
  constructor(
    @InjectRepository(Fatwa)
    private readonly fatwaRepository: Repository<Fatwa>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(FatwaCategory)
    private readonly categoryRepository: Repository<FatwaCategory>,
  ) {}

  async create(dto: CreateFatwaDto, userId: number) {
    const client = await this.userRepository.findOne({ where: { id: userId } });
    if (!client) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category #${dto.categoryId} not found`);
    }

    const fatwa = this.fatwaRepository.create({
      subject: dto.subject,
      question: dto.question,
      status: FatwaStatus.PENDING,
      category_id: dto.categoryId,
      category,
      client_id: userId,
      client,
      created_by: userId,
    });

    const saved = await this.fatwaRepository.save(fatwa);

    return {
      success: true,
      message: 'Fatwa query created successfully',
      data: saved,
    };
  }

  async findAll() {
    const data = await this.fatwaRepository.find();
    return {
      success: true,
      message: 'Fatwa queries fetched successfully',
      data,
    };
  }

  async findOne(id: number) {
    const fatwa = await this.fatwaRepository.findOne({ where: { id } });
    if (!fatwa) {
      throw new NotFoundException(`Fatwa #${id} not found`);
    }
    return {
      success: true,
      message: 'Fatwa query fetched successfully',
      data: fatwa,
    };
  }

  async update(id: number, dto: UpdateFatwaDto) {
    const existing = await this.fatwaRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Fatwa #${id} not found`);
    }

    // explicitly allow null
    let client: User | null = existing.client;
    if (dto.clientId) {
      client = await this.userRepository.findOne({ where: { id: dto.clientId } });
      if (!client) throw new NotFoundException(`User #${dto.clientId} not found`);
    }

    let category: FatwaCategory | null = existing.category;
    if (dto.categoryId) {
      category = await this.categoryRepository.findOne({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category #${dto.categoryId} not found`);
      }
    }

    Object.assign(existing, {
      subject: dto.subject ?? existing.subject,
      question: dto.question ?? existing.question,
      status: dto.status ?? existing.status,
      client: client ?? existing.client,
      category: category ?? existing.category,
    });

    const updated = await this.fatwaRepository.save(existing);

    return {
      success: true,
      message: 'Fatwa query updated successfully',
      data: updated,
    };
  }

  async toggleStatus(id: number) {
    const existing = await this.fatwaRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Fatwa #${id} not found`);
    }

    const statusFlow = [
      FatwaStatus.PENDING,
      FatwaStatus.ASSIGNED,
      FatwaStatus.SUBMITTED,
      FatwaStatus.REVIEWED,
      FatwaStatus.COMPLETE,
    ];

    const currentIndex = statusFlow.indexOf(existing.status);
    const nextIndex = (currentIndex + 1) % statusFlow.length;
    existing.status = statusFlow[nextIndex];

    const updated = await this.fatwaRepository.save(existing);

    return {
      success: true,
      message: `Fatwa status changed to ${updated.status}`,
      data: {
        id: updated.id,
        status: updated.status,
      },
    };
  }
}
