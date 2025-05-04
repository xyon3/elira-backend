import { User } from "src/users/entities/user.entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Publication {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column()
    authors: string;

    @Column({ name: "issue_date" })
    issueDate: string;

    @Column({ nullable: true })
    degree: string;

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

    @ManyToOne(() => User, (user) => user.publications, { eager: true })
    @JoinColumn({ name: "uploaded_by" })
    uploadedBy: User;
}
