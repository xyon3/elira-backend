import { Module } from "@nestjs/common";
import { StatusService } from "./status.service";
import { StatusController } from "./status.controller";
import { PublicationRepository } from "src/publications/publication.repository";
import { BookRepository } from "src/books/books.repository";
import { UserRepository } from "src/users/users.repository";
import { PopularityProvider } from "src/providers/popularity.provider";

@Module({
    controllers: [StatusController],
    providers: [
        StatusService,
        PublicationRepository,
        BookRepository,
        UserRepository,
        PopularityProvider,
    ],
})
export class StatusModule {}
