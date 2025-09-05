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
import { ReviewStatus } from 'src/common/enums/fatwah.enum';

@Entity('fatwa_reviews')
export class FatwaReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fatwa_answer_id: number;

  @ManyToOne(() => FatwaAnswer, { eager: true })
  @JoinColumn({ name: 'fatwa_answer_id' })
  fatwaAnswer: FatwaAnswer;

  @Column()
  teacher_id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    nullable: false,
  })
  action: ReviewStatus;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

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
