import { Fatwa } from 'src/fatwa-queries/entity/fatwa-queries.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from 'typeorm';
//import { Fatwa } from './fatwa.entity';

@Entity()
export class FatwaCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({
        type: 'smallint',
        default: 1,
        nullable: false,
        comment: '0 = inactive, 1 = active',
    })
    status: number;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    created_at: string;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
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

    @OneToMany(() => Fatwa, (fatwa) => fatwa.category)
    fatwas: Fatwa[];

}
