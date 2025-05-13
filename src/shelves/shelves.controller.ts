import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    Query,
} from "@nestjs/common";
import { ShelvesService } from "./shelves.service";
import { CreateShelfDto } from "./dto/create-shelf.dto";

@Controller("shelves")
export class ShelvesController {
    constructor(private readonly shelvesService: ShelvesService) {}

    @Post()
    create(@Body() createShelfDto: CreateShelfDto) {
        return this.shelvesService.create(createShelfDto);
    }

    @Get()
    findAll(@Query("filter") filter: string, @Query("max") max: string) {
        if (filter === "id_only") {
            return this.shelvesService.findAllShelfID();
        }
        return this.shelvesService.findAll(+max);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.shelvesService.findOne(id);
    }

    @Put(":id/book")
    update(
        @Param("id") id: string,
        @Query("action") action: string,
        @Query("book_id") bookID: string,
    ) {
        if (action === "add") {
            return this.shelvesService.addBook(id, bookID);
        }
        if (action === "remove") {
            return this.shelvesService.removeBook(id, bookID);
        }
        return { msg: "no ops" };
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.shelvesService.remove(id);
    }
}
