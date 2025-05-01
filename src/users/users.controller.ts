import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Put,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get("roles")
    getRoles() {
        return this.usersService.describeRoles();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.usersService.findOne(+id);
    }

    @Put(":id")
    activate(@Param("id") id: string) {
        return this.usersService.activateUser(+id);
    }

    @Delete(":id")
    deactivate(@Param("id") id: string) {
        return this.usersService.deactivateUser(+id);
    }
}
