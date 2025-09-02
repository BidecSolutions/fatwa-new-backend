// src/fatwa-assignments/entity/fatwa-teacher-assignment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { FatwaAnswer } from 'src/fatwa-answers/entity/fatwa-answer.entity';
import { AssignmentStatus } from 'src/common/enums/fatwah.enum';

@Entity('fatwa_teacher_assignments')
export class FatwaTeacherAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fatwa_answer_id: number;

  @ManyToOne(() => FatwaAnswer, (answer) => answer.teacherAssignments, { eager: true })
  @JoinColumn({ name: 'fatwa_answer_id' })
  fatwaAnswer: FatwaAnswer;

  @Column()
  teacher_id: number;

  @ManyToOne(() => User, (user) => user.teacherAssignments, { eager: true })
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @Column({
    type: 'enum',
    enum: AssignmentStatus,
    default: AssignmentStatus.ASSIGNED,
  })
  status: AssignmentStatus;

  @Column({ type: 'date' })
  created_at: string;

  @Column({ type: 'date' })
  updated_at: string;

  @BeforeInsert()
  setCreateDateParts() {
    const today = new Date();
    const onlyDate = today.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    this.created_at = onlyDate;
    this.updated_at = onlyDate;
  }
}
