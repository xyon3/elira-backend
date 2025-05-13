import { Injectable } from "@nestjs/common";
import { Shelf } from "src/shelves/entities/shelf.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class ShelfRepository extends Repository<Shelf> {
    constructor(private dataSource: DataSource) {
        super(Shelf, dataSource.createEntityManager());
    }
}
