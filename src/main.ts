import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: "*",
        methods: "*",
    });

    app.use(cookieParser());

    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    frameAncestors: [
                        "'self'",
                        "http://localhost:8000",
                        "https://elira-frontend.vercel.app",
                        "http://ec2-54-179-190-76.ap-southeast-1.compute.amazonaws.com:3000",
                        "http://ec2-54-179-190-76.ap-southeast-1.compute.amazonaws.com",
                    ], // 👈 allow Next.js dev server to iframe this
                },
            },
            hsts: false,
        }),
    );

    app.setGlobalPrefix("api");

    await app.listen(process.env.APPLICATION_PORT ?? 3443);
}
bootstrap();
