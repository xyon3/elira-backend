import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.findOneBy({ email });
    }

    async findWithRole(): Promise<User[]> {
        return this.find({ relations: ["role"] });
    }
}
