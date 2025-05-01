import { Module } from "@nestjs/common";
import { BooksService } from "./books.service";
import { BooksController } from "./books.controller";
import { BookRepository } from "./books.repository";
import { UserRepository } from "src/users/users.repository";

@Module({
    controllers: [BooksController],
    providers: [BooksService, BookRepository, UserRepository],
})
export class BooksModule {}
