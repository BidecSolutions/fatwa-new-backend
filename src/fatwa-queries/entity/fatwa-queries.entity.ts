import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BeforeInsert,
    JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { FatwaCategory } from 'src/category/entity/category.entity';

@Entity()
export class Fatwa {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    subject: string;

    @Column()
    question: string;

    @Column({ type: 'text', nullable: true })
    answer: string | null;

    @Column({ default: false })
    reviewed: boolean;

    @Column()
    category_id: number;

    // 🔁 Many fatwas belong to one category
    @ManyToOne(() => FatwaCategory, (category) => category.fatwas, { eager: true })
    @JoinColumn({name : 'category_id'})
    category: FatwaCategory;

    @Column()
    client_id: number;

    // 🔐 Many fatwas belong to one user (a user can submit multiple queries)
    @ManyToOne(() => User, (user) => user.fatwas, { eager: true})
    @JoinColumn({ name: 'client_id' })
    client: User;

    @Column({
        type: 'smallint',
        default: 1,
        nullable: false,
        comment: '0 = inactive, 1 = active',
    })
    status: number;

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
