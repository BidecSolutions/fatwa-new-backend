import { Module } from '@nestjs/common';
import { FatwaAnswerService } from './fatwa-answers.service';
import { FatwaAnswerController } from './fatwa-answers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FatwaAnswer } from './entity/fatwa-answer.entity';
import { User } from 'src/users/entity/user.entity';
import { Fatwa } from 'src/fatwa-queries/entity/fatwa-queries.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FatwaAnswer,User,Fatwa])],
  providers: [FatwaAnswerService],
  controllers: [FatwaAnswerController]
})
export class FatwaAnswersModule {}
