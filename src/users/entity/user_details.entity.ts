import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../entity/user.entity';

@Entity()
export class UserDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  identity_no: string;

  @Column()
  identity_validity_date: Date;

  @Column({ nullable: true })
  identity_card_front_url: string;

  @Column({ nullable: true })
  identity_card_back_url: string;


  @Column()
  user_id: number;

  @OneToOne(() => User, (user) => user.userDetails)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
