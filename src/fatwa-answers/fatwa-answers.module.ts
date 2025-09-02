import { Module } from '@nestjs/common';
import {  FatwaAnswersService } from './fatwa-answers.service';
import {  FatwaAnswersController } from './fatwa-answers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FatwaAnswer } from './entity/fatwa-answer.entity';
import { User } from 'src/users/entity/user.entity';
import { Fatwa } from 'src/fatwa-queries/entity/fatwa-queries.entity';
import { fatwa_student_assignments } from 'src/fatwa-student-assignments/entity/fatwa-student-assignment.entity';


@Module({
  imports: [TypeOrmModule.forFeature([FatwaAnswer,fatwa_student_assignments,User,Fatwa])],
  providers: [FatwaAnswersService],
  controllers: [FatwaAnswersController]
})
export class FatwaAnswersModule {}
