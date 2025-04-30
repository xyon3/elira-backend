import { User } from "src/users/entities/user.entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Book {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    title: string;

    @Column()
    description: string;

    @Column({ name: "view_count" })
    viewCount: number;

    @Column({
        name: "upload_date",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    })
    uploadDate: Date;

    @ManyToOne(() => User, (user) => user.books, { eager: true })
    @JoinColumn({ name: "uploaded_by" })
    uploadedBy: User;
}
