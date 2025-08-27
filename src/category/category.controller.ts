import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AdminJwtAuthGuard } from 'src/auth/admin/admin-jwt.guard';
import { UserJwtAuthGuard } from 'src/auth/user/user-jwt.guard';
import { FatwaCategoryService } from './category.service';
import { CreateFatwaCategoryDto, UpdateFatwaCategoryDto } from './dto/category.dto';

@Controller('fatwa-category')
export class FatwaCategoryController {
  constructor(private readonly service: FatwaCategoryService) {}

  @UseGuards(AdminJwtAuthGuard)
  @Post('store')
  async store(@Body() body: CreateFatwaCategoryDto) {
    return await this.service.create(body);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get('list-all-categories')
  async findAll() {
    return await this.service.findAll();
  }

  @UseGuards(UserJwtAuthGuard)
  @Get('list-all-fatwa-categories')
  async findAllUser() {
    return await this.service.findAll();
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.service.findOne(id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateFatwaCategoryDto,
  ) {
    return await this.service.update(id, dto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.service.delete(id);
  }
}

