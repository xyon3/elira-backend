import {
    Body,
    Controller,
    Param,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { FileService } from "./file.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { existsSync, mkdirSync } from "fs";
import { Request } from "express";
import { randomUUID } from "crypto";
import { BooksService } from "src/books/books.service";
import { PublicationsService } from "src/publications/publications.service";

function filter(req, file, cb) {
    if (file.mimetype !== "application/pdf") {
        return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
}

@Controller("file")
export class FileController {
    constructor(
        private readonly fileService: FileService,
        private readonly booksService: BooksService,
        private readonly publicationsService: PublicationsService,
    ) {}

    @Post("books/upload")
    @UseInterceptors(
        FileInterceptor("file", {
            fileFilter: filter,
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const uploadPath = "./uploads/books";

                    if (!existsSync(uploadPath)) {
                        mkdirSync(uploadPath, { recursive: true });
                    }
                    cb(null, uploadPath);
                },
                filename: (req: Request, file, cb) => {
                    const uid = randomUUID().toString().replaceAll("-", "");
                    const ext = extname(file.originalname);
                    const basename = file.originalname.replace(ext, "");

                    cb(null, `${uid}-${basename}${ext}`);
                },
            }),
        }),
    )
    async uploadBook(
        @UploadedFile() file: Express.Multer.File,
        @Query() subject: { unique: string },
    ) {
        const filename = file.filename;
        const prefixID = filename.split("-")[0];

        const book = await this.booksService.update(subject.unique, {
            prefixID,
            filename,
            path: "/files/books",
            uploadDate: new Date(Date.now()),
        });

        return {
            message: "Book uploaded successfully",
            filename,
            book,
        };
    }

    @Post("publications/upload")
    @UseInterceptors(
        FileInterceptor("file", {
            fileFilter: filter,
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const uploadPath = "./uploads/publication";

                    if (!existsSync(uploadPath)) {
                        mkdirSync(uploadPath, { recursive: true });
                    }
                    cb(null, uploadPath);
                },
                filename: (req, file, cb) => {
                    const uid = randomUUID().toString().replaceAll("-", "");
                    const ext = extname(file.originalname);
                    const basename = file.originalname.replace(ext, "");

                    cb(null, `${uid}-${basename}${ext}`);
                },
            }),
        }),
    )
    async uploadPublication(
        @UploadedFile() file: Express.Multer.File,
        @Query() subject: { unique: string },
    ) {
        const filename = file.filename;
        const prefixID = filename.split("-")[0];

        const book = await this.publicationsService.update(subject.unique, {
            prefixID,
            filename,
            path: "/files/publication",
            uploadDate: new Date(Date.now()),
        });

        return {
            message: "Publication uploaded successfully",
            filename,
            book,
        };
    }
}
