import { Module } from "@nestjs/common";
import { StatusService } from "./status.service";
import { StatusController } from "./status.controller";
import { PublicationRepository } from "src/publications/publication.repository";
import { BookRepository } from "src/books/books.repository";
import { UserRepository } from "src/users/users.repository";

@Module({
    controllers: [StatusController],
    providers: [
        StatusService,
        PublicationRepository,
        BookRepository,
        UserRepository,
    ],
})
export class StatusModule {}
