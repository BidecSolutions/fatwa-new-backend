
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { fatwa_student_assignments} from './entity/fatwa-student-assignment.entity';
import { Fatwa } from 'src/fatwa-queries/entity/fatwa-queries.entity';
import { User } from 'src/users/entity/user.entity';
import { FatwaAssignmentsController } from './fatwa-student-assignments.controller';
import { FatwaAssignmentsService } from './fatwa-student-assignments.service';

@Module({
  imports: [TypeOrmModule.forFeature([fatwa_student_assignments, Fatwa, User])],
  controllers: [FatwaAssignmentsController],
  providers: [FatwaAssignmentsService],
  exports: [FatwaAssignmentsService],
})
export class FatwaAssignmentModule {}

