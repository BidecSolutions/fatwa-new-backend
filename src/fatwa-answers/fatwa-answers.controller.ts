import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserJwtAuthGuard } from 'src/auth/user/user-jwt.guard';
import { AdminJwtAuthGuard } from 'src/auth/admin/admin-jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { CreateFatwaAnswerDto, UpdateFatwaAnswerDto } from './dto/fatwa-answer.dto';
import { FatwaAnswerService } from './fatwa-answers.service';

@Controller('fatwa-answers')
export class FatwaAnswerController {
  constructor(private readonly service: FatwaAnswerService) {}

  @UseGuards(UserJwtAuthGuard)
  @Post('store')
  async create(
    @Body() dto: CreateFatwaAnswerDto,
    @CurrentUser() user: User,
  ) {
    return this.service.create(dto, user);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get('admin/fatwa/:fatwaId')
  async findByFatwaForAdmin(@Param('fatwaId') fatwaId: number) {
    return this.service.findByFatwaForAdmin(+fatwaId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get('user/fatwa/:fatwaId')
  async findByFatwaForUser(
    @Param('fatwaId') fatwaId: number,
    @CurrentUser() user: User,
  ) {
    return this.service.findByFatwaForUser(+fatwaId, user);
  }

  @UseGuards(UserJwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateFatwaAnswerDto,
    @CurrentUser() user: User,
  ) {
    return this.service.update(+id, dto, user);
  }

  @UseGuards(UserJwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number, @CurrentUser() user: User) {
    return this.service.delete(+id, user);
  }
}

