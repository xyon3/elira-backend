import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from "@nestjs/common";
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";

@Controller("books")
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @Post()
    create(@Body() createBookDto: CreateBookDto) {
        return this.booksService.create(createBookDto);
    }

    @Get()
    findAll(
        @Query("isPaginated") isPaginated: string,
        @Query("page") page: string,
        @Query("limit") limit: string,
        @Query("randomize") randomize: string,
    ) {
        if (isPaginated === "1") {
            return this.booksService.findAll(
                parseInt(isPaginated),
                parseInt(page),
                parseInt(limit),
                parseInt(randomize),
            );
        }
        return this.booksService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.booksService.findOne(id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateBookDto: UpdateBookDto) {
        return this.booksService.update(id, updateBookDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.booksService.remove(id);
    }
}
