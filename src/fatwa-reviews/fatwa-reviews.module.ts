import { Module } from '@nestjs/common';
import { FatwaReviewsService } from './fatwa-reviews.service';
import { FatwaReviewsController } from './fatwa-reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FatwaReview } from './entity/fatwa-reviews.entity';
import { User } from 'src/users/entity/user.entity';
import { FatwaAnswer } from 'src/fatwa-answers/entity/fatwa-answer.entity';
import { Fatwa } from 'src/fatwa-queries/entity/fatwa-queries.entity';

@Module({
  imports:[TypeOrmModule.forFeature([FatwaReview,User,FatwaAnswer,Fatwa])],
  providers: [FatwaReviewsService],
  controllers: [FatwaReviewsController]
})
export class FatwaReviewsModule {}
