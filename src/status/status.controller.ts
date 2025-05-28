import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from "@nestjs/common";
import { StatusService } from "./status.service";
import { CreateStatusDto } from "./dto/create-status.dto";
import { UpdateStatusDto } from "./dto/update-status.dto";

@Controller("status")
export class StatusController {
    constructor(private readonly statusService: StatusService) {}

    @Post("increment")
    async incrementResourceView(
        @Body() incrementDto: { type: string; id: string },
    ) {
        return this.statusService.incrementView(incrementDto);
    }

    @Get("most-viewed/book")
    bookMostViewed() {
        return this.statusService.bookMostViewed();
    }

    @Get("most-viewed/publication")
    publicationMostViewed() {
        return this.statusService.publicationMostViewed();
    }

    @Post("total-uploads/book")
    bookTotalUploads(@Body() totalBookUploads: { departmentID: number }) {
        return this.statusService.totalBookUploadsPerDepartment(
            totalBookUploads,
        );
    }

    @Post("total-uploads/publication")
    publicationTotalUploads(
        @Body() totalPublicationUploads: { departmentID: number },
    ) {
        return this.statusService.totalPublicationUploadsPerDepartment(
            totalPublicationUploads,
        );
    }

    @Post("v2/popularity/department")
    popularityScore2(@Body() popularityDto: { id?: number; email?: string }) {
        return this.statusService.popularityScoreV2(popularityDto);
    }

    @Post("popularity/department")
    popularityScore(@Body() popularityDto: { id?: number; email?: string }) {
        return this.statusService.popularityScorePerDepartment(popularityDto);
    }
}
