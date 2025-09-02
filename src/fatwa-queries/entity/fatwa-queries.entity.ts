import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BeforeInsert,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { FatwaCategory } from 'src/category/entity/category.entity';
//import { fatwa_student_assignments } from 'src/fatwa-assignments/entity/fatwa-student-assignment.entity';
import { FatwaStatus } from 'src/common/enums/fatwah.enum';
import { FatwaAnswer } from 'src/fatwa-answers/entity/fatwa-answer.entity';
import { fatwa_student_assignments } from 'src/fatwa-student-assignments/entity/fatwa-student-assignment.entity';



@Entity()
export class Fatwa {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    subject: string;

    @Column()
    question: string;

    @Column()
    category_id: number;


    @OneToMany(() => fatwa_student_assignments, (assignment) => assignment.fatwaQuery)
    assignments: fatwa_student_assignments[];

    @OneToMany(() => FatwaAnswer, (answer) => answer.fatwa, { cascade: true })
    answers: FatwaAnswer[];

    // 🔁 Many fatwas belong to one category
    @ManyToOne(() => FatwaCategory, (category) => category.fatwas, { eager: true })
    @JoinColumn({ name: 'category_id' })
    category: FatwaCategory;

    @Column()
    client_id: number;

    // 🔐 Many fatwas belong to one user (a user can submit multiple queries)
    @ManyToOne(() => User, (user) => user.fatwas, { eager: true })
    @JoinColumn({ name: 'client_id' })
    client: User;



    @Column({
        type: 'enum',
        enum: FatwaStatus,
        default: FatwaStatus.PENDING,
    })
    status: FatwaStatus;

    @Column({ type: 'date' })
    created_at: string;

    @Column({ type: 'date' })
    updated_at: string;

    @Column({ type: 'int', nullable: true })
    created_by: number;

    @BeforeInsert()
    setCreateDateParts() {
        const today = new Date();
        const onlyDate = today.toISOString().split('T')[0]; // 'YYYY-MM-DD'
        this.created_at = onlyDate;
        this.updated_at = onlyDate;
    }
}
