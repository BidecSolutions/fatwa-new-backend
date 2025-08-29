import { Module } from '@nestjs/common';
import { FatwaAnswersService } from './fatwa-answers.service';
import { FatwaAnswersController } from './fatwa-answers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FatwaAnswer } from './entity/fatwa-answer.entity';
import { User } from 'src/users/entity/user.entity';
import { FatwaAssignment } from 'src/fatwa-assignments/entity/fatwa-assignment.entity';
import { Fatwa } from 'src/fatwa-queries/entity/fatwa-queries.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FatwaAnswer,User,Fatwa])],
  providers: [FatwaAnswersService],
  controllers: [FatwaAnswersController]
})
export class FatwaAnswersModule {}
