import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthenticateDto } from "./dto/authenticate.dto";

@Injectable()
export class AuthService {
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

        return {};

        // const user = await database
        //     .select()
        //     .from(users)
        //     .where(
        //         and(
        //             eq(users.email, authenticateDto.email),
        //             eq(users.passcode, authenticateDto.password),
        //         ),
        //     );

        // if (user.length === 0) {
        //     throw new HttpException(
        //         "email or password is wrong",
        //         HttpStatus.UNAUTHORIZED,
        //     );
        // }
        //
        // return user;
    }
}
