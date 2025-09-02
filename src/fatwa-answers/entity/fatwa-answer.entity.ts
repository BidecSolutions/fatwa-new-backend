import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,

} from 'typeorm';
import { Fatwa } from 'src/fatwa-queries/entity/fatwa-queries.entity';
import { User } from 'src/users/entity/user.entity';

@Entity()
export class FatwaAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fatwa_id: number;

  @ManyToOne(() => Fatwa, (fatwa) => fatwa.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fatwa_id' })
  fatwa: Fatwa;

  @Column()
  student_id: number;

  @ManyToOne(() => User, (user) => user.answers, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({ type: 'text' })
  content: string;


  // @Column({
  //  type: 'int',
  //  nullable: true,
  //  comment: '0 = no parent (top-level answer), otherwise stores parent answer id',
  // })
  // parent_answer_id: number;

  @Column({ default: false })
  is_final: boolean;

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
