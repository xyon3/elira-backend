import { Book } from "src/books/entities/book.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Shelf {
    @PrimaryColumn()
    _id: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => Book, (book) => book.shelf, { eager: true })
    books: Book[];
}
