import { Module } from '@nestjs/common';
import { FatwaQueriesController } from './fatwa-queries.controller';
import { FatwaQueriesService } from './fatwa-queries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fatwa } from './entity/fatwa-queries.entity';
import { FatwaCategory } from 'src/category/entity/category.entity';
import { User } from 'src/users/entity/user.entity';
import { FatwaAssignment } from 'src/fatwa-assignments/entity/fatwa-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fatwa, User, FatwaCategory,FatwaAssignment])],
  controllers: [FatwaQueriesController],
  providers: [FatwaQueriesService]
})
export class FatwaQueriesModule {}
