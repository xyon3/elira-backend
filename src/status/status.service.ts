import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateStatusDto } from "./dto/create-status.dto";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { PublicationRepository } from "src/publications/publication.repository";
import { BookRepository } from "src/books/books.repository";
import { UserRepository } from "src/users/users.repository";

@Injectable()
export class StatusService {
    constructor(
        private publicationRepository: PublicationRepository,
        private bookRepository: BookRepository,
        private userRespository: UserRepository,
    ) {}

    async incrementView(incrementDto: { type: string; id: string }) {
        if (incrementDto.type === "book") {
            const book = await this.bookRepository.findOneBy({
                id: incrementDto.id,
            });

            if (!book) {
                throw new NotFoundException("BOOK WAS NOT FOUND");
            }
            this.bookRepository.update(book, {
                viewCount: book.viewCount + 1,
            });
            return { status: "SUCCESS" };
        }
        if (incrementDto.type === "publication") {
            const publication = await this.publicationRepository.findOneBy({
                id: incrementDto.id,
            });

            if (!publication) {
                throw new NotFoundException("PUBLICATION WAS NOT FOUND");
            }
            this.publicationRepository.update(publication, {
                viewCount: publication.viewCount + 1,
            });
            return { status: "SUCCESS" };
        }
    }

    async bookMostViewed() {
        return this.bookRepository.find({
            take: 5,
            order: { viewCount: "DESC" },
        });
    }

    async publicationMostViewed() {
        return this.publicationRepository.find({
            take: 5,
            order: { viewCount: "DESC" },
        });
    }

    async getMostViewedDepartment() {}

    async totalBookUploadsPerDepartment(totalBookUploadsDto: {
        departmentID: number;
    }) {
        const department = await this.userRespository.findOneBy({
            id: totalBookUploadsDto.departmentID,
        });
        if (!department) {
            throw new NotFoundException("DEPARTMENT WAS NOT FOUND");
        }

        const length = await this.bookRepository.countBy({
            uploadedBy: { id: totalBookUploadsDto.departmentID },
        });

        return {
            totalBookUploadsDto,
            department: department.email,
            length,
        };
    }

    async totalPublicationUploadsPerDepartment(totalPublicationUploadsDto: {
        departmentID: number;
    }) {
        const department = await this.userRespository.findOneBy({
            id: totalPublicationUploadsDto.departmentID,
        });
        if (!department) {
            throw new NotFoundException("DEPARTMENT WAS NOT FOUND");
        }

        const length = await this.publicationRepository.countBy({
            uploadedBy: { id: totalPublicationUploadsDto.departmentID },
        });

        return {
            totalPublicationUploadsDto,
            department: department.email,
            length,
        };
    }

    async popularityScorePerDepartment(popularityDto: {
        id?: number;
        email?: string;
    }) {
        const weights = {
            book_upload: 0.2,
            book_views: 0.2,
            publication_upload: 0.4,
            publication_views: 0.2,
        };

        const departments = await this.userRespository.findBy({
            role: { id: 2 },
        });

        const subject = departments.filter(
            (d) => d.email === popularityDto.email,
        );

        if (subject.length == 0) {
            throw new NotFoundException("NO USER");
        }

        if (!subject[0]) {
            throw new NotFoundException("NO USER");
        }

        // const deptStatuses = departments.map((department) => {
        //     const publication_max_views = department.publications?.reduce(
        //         (sum, item) => item.viewCount + sum,
        //         0,
        //     );
        //
        //     const book_max_views = department.books?.reduce(
        //         (sum, item) => item.viewCount + sum,
        //         0,
        //     );
        //
        //     if (!publication_max_views || !book_max_views) {
        //         return { STATUS: "ERROR" };
        //     }
        //
        //     return {
        //         id: department.id,
        //         email: department.email,
        //         total_views: book_max_views + publication_max_views,
        //         publication: {
        //             count: department.publications?.length,
        //             max_views: publication_max_views,
        //         },
        //         book: {
        //             count: department.books?.length,
        //             max_views: book_max_views,
        //         },
        //     };
        // });

        const maxBookViews = Math.max(
            ...departments.map(
                (department) =>
                    department.books?.reduce(
                        (sum, item) => item.viewCount + sum,
                        0,
                    ) ?? 0,
            ),
        );

        const maxPublicationViews = Math.max(
            ...departments.map(
                (department) =>
                    department.publications?.reduce(
                        (sum, item) => item.viewCount + sum,
                        0,
                    ) ?? 0,
            ),
        );

        const bookCount = (departments ?? []).map((d) => d.books?.length ?? 0);
        const publicationCount = (departments ?? []).map(
            (d) => d.publications?.length ?? 0,
        );

        const maxBookUploads = Math.max(...bookCount);
        const maxPublicationUploads = Math.max(...publicationCount);

        const book_view_score =
            (subject[0].books?.reduce(
                (sum, b) => b.viewCount + sum,
                0,
            ) as number) / maxBookViews;

        const book_uploads_score =
            (subject[0].books?.length as number) / maxBookUploads;

        const publication_view_score =
            (subject[0].publications?.reduce(
                (sum, b) => b.viewCount + sum,
                0,
            ) as number) / maxPublicationViews;

        const publication_uploads_score =
            (subject[0].publications?.length as number) / maxPublicationUploads;

        return {
            email: popularityDto.email,
            popularity:
                weights.book_views * book_view_score +
                weights.book_upload * book_uploads_score +
                weights.publication_views * publication_view_score +
                weights.publication_upload * publication_uploads_score,
        };
    }
}
