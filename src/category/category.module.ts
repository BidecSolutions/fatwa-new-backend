import { Module } from '@nestjs/common';
import { FatwaCategory } from './entity/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FatwaCategoryController } from './category.controller';
import { FatwaCategoryService } from './category.service';

@Module({
   imports: [TypeOrmModule.forFeature([FatwaCategory])],
  controllers: [FatwaCategoryController],
  providers: [FatwaCategoryService],
  exports: [FatwaCategoryService],
})
export class CategoryModule {}
