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
import { Fatwa } from './entity/fatwa-queries.entity';
import { FatwaStatus } from 'src/common/enums/fatwah.enum';



@Controller('fatwa-queries')
export class FatwaQueriesController {
  constructor(private readonly fatwaService: FatwaQueriesService) {}

  // 👉 User creates query
  @UseGuards(UserJwtAuthGuard)
  @Post('store')
  async create(@Body() dto: CreateFatwaDto, @Req() req) {
    const userId = req.user.id;
    return this.fatwaService.create(dto, userId);
  }

  // 👉 Admin fetches all queries
  @UseGuards(AdminJwtAuthGuard)
  @Get('index')
  async findAll() {
    return this.fatwaService.findAll();
  }

  // 👉 Admin fetches one query
  @UseGuards(AdminJwtAuthGuard)
  @Get('findone/:id')
  async findOne(@Param('id') id: number) {
    return this.fatwaService.findOne(+id);
  }

  // 👉 Admin updates query
  @UseGuards(AdminJwtAuthGuard)
  @Patch('update/:id')
  async update(@Param('id') id: number, @Body() dto: UpdateFatwaDto) {
    return this.fatwaService.update(+id, dto);
  }

  // 👉 Admin changes status (pending → assigned → submitted → reviewed → complete)
  @UseGuards(AdminJwtAuthGuard)
  @Patch('toggle-status/:id')
  async toggle(@Param('id') id: number) {
    return this.fatwaService.toggleStatus(+id);
  }
}
