import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthenticateDto } from "./dto/authenticate.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(protected readonly authService: AuthService) {}

    @Post()
    async authenticate(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
        @Body() authenticateDto: AuthenticateDto,
    ) {
        if (authenticateDto.isGuest) {
            const value = {
                role: "guest",
            };

            response.cookie("token", JSON.stringify(value), {
                path: "/",
                maxAge: 1000 * 60 * 60 * 24, // 1 day
            });
            return {
                status: "SUCCESS",
                as: "guest",
            };
        } else {
            const user = await this.authService.signin(authenticateDto);

            return {
                status: "SUCCESS",
                user,
            };
        }
    }
}
