import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Role } from "../entities/role.entity";

@Injectable()
export class RoleRepository extends Repository<Role> {
    constructor(private dataSource: DataSource) {
        super(Role, dataSource.createEntityManager());
    }
}
