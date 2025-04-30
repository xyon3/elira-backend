import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Role } from "src/common/entities/role.entity";
import { UserRepository } from "./users.repository";
import { RoleRepository } from "src/common/repositories/role.repository";
import { RolesService } from "src/common/services/roles.service";

@Module({
    imports: [TypeOrmModule.forFeature([User, Role])],
    controllers: [UsersController],
    providers: [UsersService, UserRepository, RoleRepository, RolesService],
})
export class UsersModule {}
