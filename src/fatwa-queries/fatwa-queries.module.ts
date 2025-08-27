import { Module } from '@nestjs/common';
import { FatwaQueriesController } from './fatwa-queries.controller';
import { FatwaQueriesService } from './fatwa-queries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fatwa } from './entity/fatwa-queries.entity';
import { FatwaCategory } from 'src/category/entity/category.entity';
import { User } from 'src/users/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fatwa, User, FatwaCategory])],
  controllers: [FatwaQueriesController],
  providers: [FatwaQueriesService]
})
export class FatwaQueriesModule {}
