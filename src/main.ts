import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: ["https://elira-frontend.vercel.app", "http://localhost:3000"],
        methods: "*",
    });

    app.use(cookieParser());

    app.use(
        helmet({
            hsts: false,
        }),
    );

    app.setGlobalPrefix("api");

    await app.listen(process.env.APPLICATION_PORT ?? 3443);
}
bootstrap();
