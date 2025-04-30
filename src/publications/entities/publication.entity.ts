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

    @Column({ name: "abstract" })
    _abstract: string;

    @Column()
    authors: string;

    @Column({ name: "issue_date" })
    issueDate: string;

    @Column()
    degree: string;

    @Column({ name: "view_count" })
    viewCount: number;

    @Column({
        name: "upload_date",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    })
    uploadDate: Date;

    @ManyToOne(() => User, (user) => user.publications, { eager: true })
    @JoinColumn({ name: "uploaded_by" })
    uploadedBy: User;
}
