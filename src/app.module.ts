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
import { FileModule } from "./file/file.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { UsersService } from "./users/users.service";
import { UserRepository } from "./users/users.repository";

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
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "uploads"),
            serveRoot: "/files",
        }),
        UsersModule,
        BooksModule,
        SeedersModule,
        PublicationsModule,
        FileModule,
    ],
    controllers: [AppController, AuthController, SeedersController],
    providers: [
        AppService,
        LogsService,
        RolesService,
        AuthService,
        RoleRepository,
        UserRepository,
    ],
})
export class AppModule {}
