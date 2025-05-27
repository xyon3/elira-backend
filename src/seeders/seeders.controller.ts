import { Controller, Get } from "@nestjs/common";
import { RoleRepository } from "src/common/repositories/role.repository";
import { ShelfRepository } from "src/shelf.repository/shelf.repository";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entities/user.entity";
import { UserRepository } from "src/users/users.repository";

@Controller("seed")
export class SeedersController {
    constructor(
        private roleRepository: RoleRepository,
        private shelfRepository: ShelfRepository,
        private userRepository: UserRepository,
    ) {}

    private roles = ["custodian", "uploader", "department", "guest"];

    private shelves = ["default", "SHELF-0", "SHELF-1"];

    private users = [
        {
            fullname: "JC Magayon",
            email: "necor.jc@gma.uphsl.edu.ph",
            password: "qweqweqwe",
            role: 0,
        },
        {
            fullname: "Clyde Samonte",
            email: "samonte.clyde@gma.uphsl.edu.ph",
            password: "qweqweqwe",
            role: 1,
        },
        {
            fullname: "College of Business and Administration",
            email: "cba@gma.uphsl.edu.ph",
            password: "qweqweqwe",
            role: 2,
        },
        {
            fullname: "College of Computer Studies",
            email: "ccs@gma.uphsl.edu.ph",
            password: "qweqweqwe",
            role: 2,
        },
        {
            fullname: "College of Engineering",
            email: "eng@gma.uphsl.edu.ph",
            password: "qweqweqwe",
            role: 2,
        },
    ];

    @Get()
    async seed() {
        await this.roleRepository.save(
            this.roles.map((role, index) => ({
                id: index,
                title: role,
            })),
        );
        console.log("ROLES SEEDED");

        const allRoles = await this.roleRepository.find();

        await this.userRepository.save([
            ...new Set(
                this.users
                    .map((user) => {
                        return {
                            ...user,
                            isActive: 1,
                            role: allRoles.filter(
                                (role) => user.role === role.id,
                            )[0],
                        };
                    })
                    .filter((remove) => remove !== undefined),
            ),
        ]);

        await this.shelfRepository.save(
            this.shelves.map((shelf) => ({
                _id: shelf,
            })),
        );
    }
}
