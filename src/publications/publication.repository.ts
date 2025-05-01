import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Publication } from "./entities/publication.entity";

@Injectable()
export class PublicationRepository extends Repository<Publication> {
    constructor(private dataSource: DataSource) {
        super(Publication, dataSource.createEntityManager());
    }
}
