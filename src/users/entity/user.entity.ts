import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserDetails } from './user_details.entity';
import { Exclude } from 'class-transformer';
import { UserRole } from 'src/assig-roles-user/entity/user-role.entity';
import { City } from 'src/city/entity/city.entity';
import { Fatwa } from 'src/fatwa-queries/entity/fatwa-queries.entity';
//import { fatwa_student_assignments } from 'src/fatwa-assignments/entity/fatwa-student-assignment.entity';
import { FatwaAnswer } from 'src/fatwa-answers/entity/fatwa-answer.entity';
import { fatwa_student_assignments } from 'src/fatwa-student-assignments/entity/fatwa-student-assignment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true, type: 'text' })
  address: string;

  @Column({ nullable: true })
  gender: string;

  @OneToMany(() => Fatwa, (fatwa) => fatwa.client)
  fatwas: Fatwa[];

  @OneToMany(() => fatwa_student_assignments, (assignment) => assignment.user)
  assignments: fatwa_student_assignments[];

  @OneToMany(() => FatwaAnswer, (answer) => answer.student)
  answers: FatwaAnswer[];

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  image: string;

  /*  @Column({
     type: 'geography',
     spatialFeatureType: 'Point',
     nullable: true,
     srid: 4326,
     comment: 'User location in longitude and latitude',
   })
   location: string; */

  @Column({ nullable: true })
  longitude: string;

  @Column({ nullable: true })
  latitude: string;

  // @Column({ nullable: true })
  // city_id: number;

  // @ManyToOne(() => City, { onDelete: 'CASCADE', eager: true })
  // @JoinColumn({ name: 'city_id' })
  // city: City;

  @Column({ nullable: true })
  city: string;





  @Column({
    type: 'smallint',
    default: 1,
    nullable: false,
    comment: '0 = inactive, 1 = active',
  })
  status: number;

  @Column({
    type: 'smallint',
    default: 1,
    nullable: false,
    comment: '0 = not verified, 1 = verified',
  })
  isVarified: number;

  @Column({
    type: 'smallint',
    default: 1,
    nullable: false,
    comment: '1 for online and 0 for offline',
  })
  isOnline: number;

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
  @OneToOne(() => UserDetails, (userDetails) => userDetails.user)
  userDetails: UserDetails;

  @Column({ nullable: true })
  access_token: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ nullable: true })
  fcm_token: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

}
