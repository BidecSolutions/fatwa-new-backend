import { Module } from '@nestjs/common';
import { FatwaTeacherAssignmentsController } from './fatwa-teacher-assignments.controller';
import { FatwaTeacherAssignmentsService } from './fatwa-teacher-assignments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FatwaAnswer } from 'src/fatwa-answers/entity/fatwa-answer.entity';
import { User } from 'src/users/entity/user.entity';
import { FatwaTeacherAssignment } from './entity/fatwa-teacher-assignments.entity';

@Module({
  imports:[TypeOrmModule.forFeature([FatwaTeacherAssignment, FatwaAnswer, User])],
  controllers: [FatwaTeacherAssignmentsController],
  providers: [FatwaTeacherAssignmentsService]
})
export class FatwaTeacherAssignmentsModule {}
