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
            role,
        };

        this.userRepository.save(user);

        return {};
    }

    async findAll() {
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

    async remove(id: number) {
        const user = await this.userRepository.findOneBy({ id });

        if (user == null) {
            throw new NotFoundException("user was not found");
        }

        this.userRepository.remove(user);

        return { msg: "user removed" };
    }

    async describeRoles() {
        return this.roleService.getALlPermission();
    }
}
