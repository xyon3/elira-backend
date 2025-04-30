import { Controller, Get } from "@nestjs/common";
import { RoleRepository } from "src/common/repositories/role.repository";

@Controller("seed")
export class SeedersController {
    constructor(protected readonly roleRepository: RoleRepository) {}

    private roles = ["custodian", "uploader", "department", "guest"];

    @Get()
    seed() {
        this.roleRepository.save(
            this.roles.map((role, index) => ({
                id: index,
                title: role,
            })),
        );
        console.log("ROLES SEEDED");
    }
}
