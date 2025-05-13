import { Module } from "@nestjs/common";
import { BooksService } from "./books.service";
import { BooksController } from "./books.controller";
import { BookRepository } from "./books.repository";
import { UserRepository } from "src/users/users.repository";
import { ShelfRepository } from "src/shelf.repository/shelf.repository";

@Module({
    controllers: [BooksController],
    providers: [BooksService, BookRepository, UserRepository, ShelfRepository],
})
export class BooksModule {}
