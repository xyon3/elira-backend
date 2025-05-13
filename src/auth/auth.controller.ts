import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthenticateDto } from "./dto/authenticate.dto";
import { AuthService } from "./auth.service";
import { randomUUID } from "crypto";

@Controller("auth")
export class AuthController {
    constructor(protected readonly authService: AuthService) {}

    @Post("signin")
    async authenticate(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
        @Body() authenticateDto: AuthenticateDto,
    ) {
        if (authenticateDto.isGuest) {
            const token = {
                role: "guest",
                session: randomUUID().toString(),
            };

            response.cookie("token", JSON.stringify(token), {
                path: "/",
                maxAge: 1000 * 60 * 60 * 24, // 1 day
            });
            return {
                status: "SUCCESS",
                as: "guest",
            };
        } else {
            const user = await this.authService.signin(authenticateDto);

            const token = {
                code: user.role.id,
                role: user.role.title,
                name: user.fullname,
                session: randomUUID().toString(),
                email: authenticateDto.email,
            };

            return {
                status: "SUCCESS",
                as: token.role,
                isActive: user.isActive,
                cookieParams: {
                    name: "token",
                    value: JSON.stringify(token),
                    path: "/",
                    maxAge: 1000 * 60 * 60 * 2, // 1 day
                },
            };
        }
    }
}
