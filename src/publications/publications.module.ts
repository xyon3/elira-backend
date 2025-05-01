import { Module } from "@nestjs/common";
import { PublicationsService } from "./publications.service";
import { PublicationsController } from "./publications.controller";
import { PublicationRepository } from "./publication.repository";
import { UserRepository } from "src/users/users.repository";

@Module({
    controllers: [PublicationsController],
    providers: [PublicationsService, PublicationRepository, UserRepository],
})
export class PublicationsModule {}
