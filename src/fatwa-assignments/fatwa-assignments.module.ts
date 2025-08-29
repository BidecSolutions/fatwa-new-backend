// src/fatwa-assignments/fatwa-assignment.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FatwaAssignment } from './entity/fatwa-assignment.entity';
import { Fatwa } from 'src/fatwa-queries/entity/fatwa-queries.entity';
import { User } from 'src/users/entity/user.entity';
import { FatwaAssignmentsController } from './fatwa-assignments.controller';
import { FatwaAssignmentsService } from './fatwa-assignments.service';

@Module({
  imports: [TypeOrmModule.forFeature([FatwaAssignment, Fatwa, User])],
  controllers: [FatwaAssignmentsController],
  providers: [FatwaAssignmentsService],
  exports: [FatwaAssignmentsService],
})
export class FatwaAssignmentModule {}

