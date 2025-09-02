// src/fatwa-assignments/entity/fatwa-assignment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  BeforeInsert,
} from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { Fatwa } from 'src/fatwa-queries/entity/fatwa-queries.entity';
import { AssignmentStatus } from 'src/common/enums/fatwah.enum';



@Entity('fatwa_student_assignments')
export class fatwa_student_assignments {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  fatwa_query_id: number;
  @ManyToOne(() => Fatwa, (fatwa) => fatwa.assignments, { eager: true })
  @JoinColumn({ name: 'fatwa_query_id' })
  fatwaQuery: Fatwa;

  @Column()
  user_id: number;
  @ManyToOne(() => User, (user) => user.assignments, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

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
