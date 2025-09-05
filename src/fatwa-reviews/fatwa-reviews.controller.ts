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
  ParseIntPipe,
} from '@nestjs/common';
import { FatwaReviewsService } from './fatwa-reviews.service';
import { CreateFatwaReviewDto, UpdateFatwaReviewDto } from './dto/fatwa-reviews.dto';
import { UserJwtAuthGuard } from 'src/auth/user/user-jwt.guard';

@Controller('fatwa-reviews')
@UseGuards(UserJwtAuthGuard) 
export class FatwaReviewsController {
  constructor(private readonly reviewsService: FatwaReviewsService) {}

  @Post('store')
  async create(@Body() dto: CreateFatwaReviewDto, @Req() req: any) {
   
    return this.reviewsService.create({
      ...dto,
      teacher_id: req.user.id,
    });
  }

  @Get('index')
  async findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFatwaReviewDto,
    @Req() req: any,
  ) {
    
    return this.reviewsService.update(id, {
      ...dto,
      teacher_id: req.user.id,
    });
  }

  
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.remove(id);
  }
}
