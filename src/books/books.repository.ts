import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Book } from "./entities/book.entity";

@Injectable()
export class BookRepository extends Repository<Book> {
    constructor(private dataSource: DataSource) {
        super(Book, dataSource.createEntityManager());
    }
}
