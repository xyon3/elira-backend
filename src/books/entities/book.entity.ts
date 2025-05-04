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

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ name: "view_count" })
    viewCount: number;

    @Column({ nullable: true })
    path: string;

    @Column({ nullable: true })
    filename: string;

    @Column({ nullable: true })
    prefixID: string;

    @Column({
        name: "upload_date",
        type: "timestamp",
        nullable: true,
    })
    uploadDate: Date;

    @ManyToOne(() => User, (user) => user.books, { eager: true })
    @JoinColumn({ name: "uploaded_by" })
    uploadedBy: User;
}
