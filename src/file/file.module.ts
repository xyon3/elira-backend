import { Module } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileController } from "./file.controller";
import { BooksService } from "src/books/books.service";
import { PublicationsService } from "src/publications/publications.service";
import { BookRepository } from "src/books/books.repository";
import { PublicationRepository } from "src/publications/publication.repository";
import { UserRepository } from "src/users/users.repository";
import { ShelfRepository } from "src/shelf.repository/shelf.repository";

@Module({
    controllers: [FileController],
    providers: [
        FileService,
        BooksService,
        PublicationsService,
        BookRepository,
        PublicationRepository,
        UserRepository,
        ShelfRepository,
    ],
})
export class FileModule {}
