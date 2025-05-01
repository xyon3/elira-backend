import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthenticateDto } from "./dto/authenticate.dto";
import { UserRepository } from "src/users/users.repository";

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: UserRepository) {}

    async signin(authenticateDto: AuthenticateDto) {
        if (
            authenticateDto.email == undefined ||
            authenticateDto.password == undefined
        ) {
            throw new HttpException(
                "email or password is empty",
                HttpStatus.BAD_REQUEST,
            );
        }

        const user = await this.userRepository.findOneBy({
            email: authenticateDto.email,
            password: authenticateDto.password,
        });

        console.log(user);

        if (user === null) {
            throw new HttpException(
                "Incorrect email or password",
                HttpStatus.UNAUTHORIZED,
            );
        }

        return user;
    }
}
