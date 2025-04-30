import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { BooksModule } from "./books/books.module";
import { LogsService } from "./logs/logs.service";
import { ConfigModule } from "@nestjs/config";
import { RolesService } from "./common/services/roles.service";
import { AuthService } from "./auth/auth.service";
import { AuthController } from "./auth/auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SeedersController } from "./seeders/seeders.controller";
import { SeedersModule } from "./seeders/seeders.module";
import { RoleRepository } from "./common/repositories/role.repository";
import { PublicationsModule } from "./publications/publications.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: "mysql",
            host: process.env.DB_HOST ?? "",
            port: 3306,
            username: process.env.DB_USER ?? "",
            password: process.env.DB_PASS ?? "",
            database: process.env.DB_NAME ?? "",
            entities: [__dirname + "/**/*.entity{.ts,.js}"],
            synchronize: true,
        }),
        UsersModule,
        BooksModule,
        SeedersModule,
        PublicationsModule,
    ],
    controllers: [AppController, AuthController, SeedersController],
    providers: [
        AppService,
        LogsService,
        RolesService,
        AuthService,
        RoleRepository,
    ],
})
export class AppModule {}
