import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FatwaCategory } from './entity/category.entity';
import {
  CreateFatwaCategoryDto,
  UpdateFatwaCategoryDto,
} from './dto/category.dto';

@Injectable()
export class FatwaCategoryService {
  constructor(
    @InjectRepository(FatwaCategory)
    private categoryRepo: Repository<FatwaCategory>,
  ) {}

  async create(dto: CreateFatwaCategoryDto) {
    try {
      const category = this.categoryRepo.create({
        name: dto.name,
        status: 1, // default active (entity also has default)
        created_by: dto.created_by,
      });

      const saved = await this.categoryRepo.save(category);
      return {
        success: true,
        message: 'Fatwa category created successfully.',
        data: saved,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create fatwa category.',
        error: error.message,
      });
    }
  }

  async findAll() {
    try {
      const categories = await this.categoryRepo.find();

      return {
        success: true,
        message: 'Fatwa categories fetched successfully.',
        data: categories,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to fetch fatwa categories.',
        error: error.message,
      });
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.categoryRepo.findOne({ where: { id } });

      if (!category) {
        throw new NotFoundException({
          success: false,
          message: `Fatwa category with ID ${id} not found.`,
          data: [],
        });
      }

      return {
        success: true,
        message: `Fatwa category with ID ${id} fetched successfully.`,
        data: category,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to fetch fatwa category.',
        error: error.message,
      });
    }
  }

  async update(id: number, dto: UpdateFatwaCategoryDto) {
    try {
      const result = await this.findOne(id);
      const category = result.data as FatwaCategory;

      if (dto.name) category.name = dto.name;
      if (dto.status !== undefined) category.status = dto.status;

      const updated = await this.categoryRepo.save(category);

      return {
        success: true,
        message: `Fatwa category with ID ${id} updated successfully.`,
        data: updated,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: `Failed to update fatwa category with ID ${id}.`,
        error: error.message,
      });
    }
  }

  async delete(id: number) {
    try {
      const result = await this.findOne(id);
      const category = result.data as FatwaCategory;

      // Toggle status instead of hard delete
      category.status = category.status === 1 ? 0 : 1;

      await this.categoryRepo.save(category);

      const message = category.status === 1
        ? 'Marked as Active'
        : 'Marked as Inactive';

      return {
        success: true,
        message,
        data: category,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: `Failed to delete fatwa category with ID ${id}.`,
        error: error.message,
      });
    }
  }
}
