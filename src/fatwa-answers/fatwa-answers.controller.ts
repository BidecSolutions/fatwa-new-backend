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
import { UserJwtAuthGuard } from 'src/auth/user/user-jwt.guard';
import { AdminJwtAuthGuard } from 'src/auth/admin/admin-jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entity/user.entity';
import {
  CreateFatwaAnswerDto,
  UpdateFatwaAnswerDto,
} from './dto/fatwa-answer.dto';
import { FatwaAnswersService } from './fatwa-answers.service';

@Controller('fatwa-answers')
export class FatwaAnswersController {
  constructor(private readonly service: FatwaAnswersService) { }

  // ✅ Student creates an answer
  @UseGuards(UserJwtAuthGuard)
  @Post('store')
  async create(@Body() dto: CreateFatwaAnswerDto, @CurrentUser() user: User) {
    return this.service.create(dto.fatwa_id, user.id, dto.content);
  }
  // ✅ Admin fetch all answers
  @UseGuards(AdminJwtAuthGuard)
  @Get('admin/all')
  async findAllForAdmin() {
    return this.service.findAll(); // no fatwaId → fetch all answers
  }

  @UseGuards(UserJwtAuthGuard)
  @Get('user/fatwa/:fatwaId')
  async findByFatwa(@Param('fatwaId') fatwaId: number) {
    return this.service.findOne(fatwaId);
  }

  // ✅ Update student’s own answer
  @UseGuards(UserJwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateFatwaAnswerDto,
    @CurrentUser() user: User,
  ) {
    return this.service.update(+id, user.id, dto.content);
  }

  // ✅ Delete student’s own answer
  @UseGuards(UserJwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @CurrentUser() user: User) {
    return this.service.remove(+id, user.id);
  }
}
