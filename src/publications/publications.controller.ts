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
import { PublicationsService } from "./publications.service";
import { CreatePublicationDto } from "./dto/create-publication.dto";
import { UpdatePublicationDto } from "./dto/update-publication.dto";

@Controller("publications")
export class PublicationsController {
    constructor(private readonly publicationsService: PublicationsService) {}

    @Post()
    create(@Body() createPublicationDto: CreatePublicationDto) {
        return this.publicationsService.create(createPublicationDto);
    }

    @Get()
    findAll(
        @Query("isPaginated") isPaginated: string,
        @Query("page") page: string,
        @Query("limit") limit: string,
        @Query("randomize") randomize: string,
        @Query("keyword") keyword: string,
        @Query("dept") dept: string,
    ) {
        console.log(dept);
        if (keyword) {
            if (dept) {
                return this.publicationsService.findByDept(
                    parseInt(isPaginated),
                    parseInt(page),
                    parseInt(limit),
                    parseInt(randomize),
                    dept,
                    keyword,
                );
            }
            return this.publicationsService.findAll(
                parseInt(isPaginated),
                parseInt(page),
                parseInt(limit),
                parseInt(randomize),
                keyword,
            );
        }

        if (isPaginated === "1") {
            if (dept) {
                return this.publicationsService.findByDept(
                    parseInt(isPaginated),
                    parseInt(page),
                    parseInt(limit),
                    parseInt(randomize),
                    dept,
                    keyword,
                );
            }
            return this.publicationsService.findAll(
                parseInt(isPaginated),
                parseInt(page),
                parseInt(limit),
                parseInt(randomize),
                keyword,
            );
        }
        return this.publicationsService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.publicationsService.findOne(id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updatePublicationDto: UpdatePublicationDto,
    ) {
        return this.publicationsService.update(id, updatePublicationDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.publicationsService.remove(id);
    }
}
