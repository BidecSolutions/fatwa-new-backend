// src/fatwa-queries/fatwa-queries.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FatwaQueriesService } from './fatwa-queries.service';
import { CreateFatwaDto, UpdateFatwaDto } from './dto/fatwa-queries.dto';
import { AdminJwtAuthGuard } from 'src/auth/admin/admin-jwt.guard';
import { UserJwtAuthGuard } from 'src/auth/user/user-jwt.guard';

@Controller('fatwa-queries')
export class FatwaQueriesController {
  constructor(private readonly fatwaService: FatwaQueriesService) {}

  @UseGuards(UserJwtAuthGuard)
  @Post('store')
  async create(@Body() dto: CreateFatwaDto, @Req() req) {
    const userId = req.user.id;
    return this.fatwaService.create(dto, userId);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get('index')
  async findAll() {
    return this.fatwaService.findAll();
  }

  
  @UseGuards(AdminJwtAuthGuard)
  @Get('findone:id')
  async findOne(@Param('id') id: number) {
    return this.fatwaService.findOne(+id);
  }

  
  @UseGuards(AdminJwtAuthGuard)
  @Patch('update:id')
  async update(@Param('id') id: number, @Body() dto: UpdateFatwaDto) {
    return this.fatwaService.update(+id, dto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Patch('tooglestatus:id/toggle')
  async toggle(@Param('id') id: number) {
    return this.fatwaService.toggleStatus(+id);
  }
}
