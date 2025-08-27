import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fatwa } from './entity/fatwa-queries.entity';
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
    ) { }

    
    async create(dto: CreateFatwaDto, userId: number) {
        const client = await this.userRepository.findOne({ where: { id: userId } });
        if (!client) {
            throw new NotFoundException({
                success: false,
                message: `User #${userId} not found`,
            });
        }
        const category = await this.categoryRepository.findOne({ where: { id: dto.categoryId } });
        if (!category) {
            throw new NotFoundException({
                success: false,
                message: `Category #${dto.categoryId} not found`,
            });
        }

        const fatwa = this.fatwaRepository.create({
            subject: dto.subject,
            question: dto.question,
            answer: dto.answer ?? null,
            reviewed: dto.reviewed ?? false,
            status: 1,
            category_id: dto.categoryId,
            category: category,
            client_id: userId,
            client: client,
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
            throw new NotFoundException({
                success: false,
                message: `Fatwa #${id} not found`,
            });
        }
        return {
            success: true,
            message: 'Fatwa query fetched successfully',
            data: fatwa,
        };
    }
    async update(id: number, dto?: UpdateFatwaDto) {
        if (!dto) dto = {};

        const existing = await this.fatwaRepository.findOne({ where: { id } });
        if (!existing) {
            throw new NotFoundException({
                success: false,
                message: `Fatwa #${id} not found`,
            });
        }

        
        let client = existing.client;
        if (dto.clientId) {
             const client = await this.userRepository.findOne({ where: { id: dto.clientId } });
            if (!client) throw new NotFoundException(`User #${dto.clientId} not found`);
        }

        
        let category = existing.category;
        if (dto.categoryId) {
            const category = await this.categoryRepository.findOne({ where: { id: dto.categoryId } });
            if (!category) throw new NotFoundException(`Category #${dto.categoryId} not found`);
        }

        Object.assign(existing, {
            subject: dto.subject ?? existing.subject,
            question: dto.question ?? existing.question,
            answer: dto.answer ?? existing.answer,
            reviewed: dto.reviewed ?? existing.reviewed,
            client,
            category,
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
            return {
                statusCode: 404,
                message: 'Fatwa query not found',
            };
        }

        existing.status = existing.status === 1 ? 0 : 1;
        const updated = await this.fatwaRepository.save(existing);

        return {
            statusCode: 200,
            message: `Fatwa query ${updated.status === 1 ? 'activated' : 'deactivated'} successfully`,
            data: {
                id: updated.id,
                status: updated.status === 1 ? 'active' : 'inactive',
            },
        };
    }
}
