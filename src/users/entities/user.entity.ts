import { Book } from "src/books/entities/book.entity";
import { Role } from "src/common/entities/role.entity";
import { Publication } from "src/publications/entities/publication.entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullname: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    isActive: number;

    @ManyToOne(() => Role, (role) => role.users, { eager: true })
    @JoinColumn({ name: "role_id" })
    role: Role;

    @OneToMany(() => Book, (book) => book.uploadedBy, {
        lazy: true,
    })
    books?: Book[];

    @OneToMany(() => Publication, (publication) => publication.uploadedBy, {
        lazy: true,
    })
    publications?: Publication[];
}
