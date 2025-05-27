import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserRepository } from "./users.repository";
import { User } from "./entities/user.entity";
import { RoleRepository } from "src/common/repositories/role.repository";
import { RolesService } from "src/common/services/roles.service";

@Injectable()
export class UsersService {
    constructor(
        protected readonly userRepository: UserRepository,
        protected readonly roleRepository: RoleRepository,
        protected readonly roleService: RolesService,
    ) {}

    async create(createUserDto: CreateUserDto) {
        const userFound = await this.userRepository.findByEmail(
            createUserDto.email,
        );

        if (userFound !== null) {
            throw new HttpException(
                "email already been used",
                HttpStatus.CONFLICT,
            );
        }

        const role = await this.roleRepository.findOneBy({
            id: createUserDto.role,
        });

        if (role === null) {
            throw new HttpException("role is invalid", HttpStatus.BAD_REQUEST);
        }

        const user: User = {
            ...createUserDto,
            isActive: 1,
            role,
        };

        this.userRepository.save(user);

        return {};
    }

    async findAll(filter: string) {
        if (filter === "depts") {
            return {
                users: await this.userRepository.find({
                    where: { role: { id: 2 } },

                    relations: ["role"], // 👈 make sure the role relation is loaded
                }),
            };
        }

        return { users: await this.userRepository.find() };
    }

    async findOne(id: number) {
        const userfound = await this.userRepository.findOneBy({
            id,
        });

        if (userfound === null) {
            throw new NotFoundException("user was not found");
        }
        console.log(userfound);

        const permissions = this.roleService.getPermission(
            userfound.role.title,
        );

        return {
            ...userfound,
            role: { title: userfound.role.title, permissions },
        };
    }

    async activateUser(id: number) {
        const user = await this.userRepository.findOneBy({ id });

        if (user == null) {
            throw new NotFoundException("user was not found");
        }

        this.userRepository.update(user.id, {
            isActive: 1,
        });

        return { msg: "user removed" };
    }

    async deactivateUser(id: number) {
        const user = await this.userRepository.findOneBy({ id });

        if (user == null) {
            throw new NotFoundException("user was not found");
        }

        this.userRepository.update(user.id, {
            isActive: 0,
        });

        return { msg: "user removed" };
    }

    async deleteUser(id: number) {
        try {
            const user = await this.userRepository.findOneBy({ id });

            if (user == null) {
                throw new NotFoundException("user was not found");
            }
            await this.userRepository.delete({
                id: user.id,
            });
            return { msg: "user deleted" };
        } catch (e) {
            return { msg: "err", e };
        }
    }

    async describeRoles() {
        return this.roleService.getALlPermission();
    }
}
