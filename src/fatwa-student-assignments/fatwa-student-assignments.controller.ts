
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FatwaAssignmentsService } from './fatwa-student-assignments.service';
import { CreateFatwaAssignmentDto, UpdateFatwaAssignmentDto } from './dto/fatwa-assignment.dto';
import { AdminJwtAuthGuard } from 'src/auth/admin/admin-jwt.guard';

@Controller('fatwa-assignments')
export class FatwaAssignmentsController {
  constructor(private readonly assignmentService: FatwaAssignmentsService) {}

  @UseGuards(AdminJwtAuthGuard)
  @Post('store')
  async create(@Body() dto: CreateFatwaAssignmentDto) {
    return this.assignmentService.create(dto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get('index')
  async findAll() {
    return this.assignmentService.findAll();
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get('findone/:id')
  async findOne(@Param('id') id: number) {
    return this.assignmentService.findOne(+id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Patch('update/:id')
  async update(@Param('id') id: number, @Body() dto: UpdateFatwaAssignmentDto) {
    return this.assignmentService.update(+id, dto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Patch('toggle-status/:id')
  async toggle(@Param('id') id: number) {
    return this.assignmentService.toggleStatus(+id);
  }
}
