// src/fatwa-teacher-assignments/fatwa-teacher-assignments.controller.ts
import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { FatwaTeacherAssignmentsService } from './fatwa-teacher-assignments.service';
import {
    CreateFatwaTeacherAssignmentDto,
    UpdateFatwaTeacherAssignmentDto,
} from './dto/fatwa-teacher-assignments.dto';
import { AdminJwtAuthGuard } from 'src/auth/admin/admin-jwt.guard';
import { UserJwtAuthGuard } from 'src/auth/user/user-jwt.guard';

@Controller('fatwa-teacher-assignments')
export class FatwaTeacherAssignmentsController {
    constructor(
        private readonly teacherAssignmentService: FatwaTeacherAssignmentsService,
    ) { }

    /** Assign fatwa answer to teacher */
    @UseGuards(AdminJwtAuthGuard)
    @Post('store')
    async create(@Body() dto: CreateFatwaTeacherAssignmentDto) {
        return this.teacherAssignmentService.create(dto);
    }

    /** List all teacher assignments */
    @UseGuards(AdminJwtAuthGuard)
    @Get('index')
    async findAll() {
        return this.teacherAssignmentService.findAll();
    }

    /** Fetch single assignment */
    @UseGuards(AdminJwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.teacherAssignmentService.findOne(id);
    }


    /** Update assignment (teacher or status) */
    @UseGuards(AdminJwtAuthGuard)
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateFatwaTeacherAssignmentDto,
    ) {
        return this.teacherAssignmentService.update(id, dto);
    }

    /** Toggle status (ASSIGNED <-> SUBMITTED) */
    @UseGuards(AdminJwtAuthGuard)
    @Patch(':id/toggle')
    async toggleStatus(@Param('id', ParseIntPipe) id: number) {
        return this.teacherAssignmentService.toggleStatus(id);
    }

    /** Check if fatwa answer is verified by minimum teachers */
    @Get('verify/:fatwaAnswerId')
    async isVerified(
        @Param('fatwaAnswerId', ParseIntPipe) fatwaAnswerId: number,
        @Query('minTeachers') minTeachers?: number,
    ) {
        const verified = await this.teacherAssignmentService.isVerifiedByMinTeachers(
            fatwaAnswerId,
            minTeachers ? +minTeachers : 3,
        );
        return {
            success: true,
            message: verified
                ? 'Fatwa answer verified by minimum teachers'
                : 'Not enough teacher verifications',
            verified,
        };
    }

}
