import { Module } from "@nestjs/common";
import { SeedersController } from "./seeders.controller";
import { UserRepository } from "src/users/users.repository";
import { RoleRepository } from "src/common/repositories/role.repository";
import { ShelfRepository } from "src/shelf.repository/shelf.repository";

@Module({
    controllers: [SeedersController],
    providers: [UserRepository, RoleRepository, ShelfRepository],
})
export class SeedersModule {}
