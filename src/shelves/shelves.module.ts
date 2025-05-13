import { Module } from "@nestjs/common";
import { ShelvesService } from "./shelves.service";
import { ShelvesController } from "./shelves.controller";
import { ShelfRepository } from "src/shelf.repository/shelf.repository";
import { BookRepository } from "src/books/books.repository";

@Module({
    controllers: [ShelvesController],
    providers: [ShelvesService, ShelfRepository, BookRepository],
})
export class ShelvesModule {}
