import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateStatusDto } from "./dto/create-status.dto";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { PublicationRepository } from "src/publications/publication.repository";
import { BookRepository } from "src/books/books.repository";
import { UserRepository } from "src/users/users.repository";
import { PopularityProvider } from "src/providers/popularity.provider";

@Injectable()
export class StatusService {
    constructor(
        private publicationRepository: PublicationRepository,
        private bookRepository: BookRepository,
        private userRespository: UserRepository,
        private popularityProvider: PopularityProvider,
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

    async popularityScoreV2(popularityDto: { id?: number; email?: string }) {
        return this.popularityProvider.execute(popularityDto.email);
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

        // Load users with their books and publications
        const departments = await this.userRespository.find({
            where: {
                role: { id: 2 },
            },
            relations: ["books", "publications"],
        });

        const subject = departments.find(
            (d) => d.email === popularityDto.email,
        );

        if (!subject) {
            throw new NotFoundException("NO USER");
        }

        // Helpers
        const safeArray = <T>(arr: T[] | undefined | null): T[] =>
            Array.isArray(arr) ? arr : [];

        const sumViews = (arr: any[]) =>
            arr.reduce(
                (sum, item) => sum + (item.viewCount ?? item.view_count ?? 0),
                0,
            );

        // Metrics for all departments
        const bookViews = departments.map((dept) =>
            sumViews(safeArray(dept.books)),
        );
        const publicationViews = departments.map((dept) =>
            sumViews(safeArray(dept.publications)),
        );

        const maxBookViews = Math.max(...bookViews, 1);
        const maxPublicationViews = Math.max(...publicationViews, 1);

        const bookUploads = departments.map(
            (dept) => safeArray(dept.books).length,
        );
        const publicationUploads = departments.map(
            (dept) => safeArray(dept.publications).length,
        );

        const maxBookUploads = Math.max(...bookUploads, 1);
        const maxPublicationUploads = Math.max(...publicationUploads, 1);

        // Subject-specific values
        const subjectBooks = safeArray(subject.books);
        const subjectPublications = safeArray(subject.publications);

        const subjectBookViews = sumViews(subjectBooks);
        const subjectBookUploads = subjectBooks.length;

        const subjectPublicationViews = sumViews(subjectPublications);
        const subjectPublicationUploads = subjectPublications.length;

        // Scoring
        const book_view_score = subjectBookViews / maxBookViews;
        const book_uploads_score = subjectBookUploads / maxBookUploads;
        const publication_view_score =
            subjectPublicationViews / maxPublicationViews;
        const publication_uploads_score =
            subjectPublicationUploads / maxPublicationUploads;

        // Final popularity calculation
        const popularity =
            weights.book_views * book_view_score +
            weights.book_upload * book_uploads_score +
            weights.publication_views * publication_view_score +
            weights.publication_upload * publication_uploads_score;

        // Debug logs
        console.log("--- Popularity Score Debug ---");
        console.log("Weights:", weights);
        console.log("Subject:", subject.email);
        console.log("Book Views:", subjectBookViews);
        console.log("Max Book Views:", maxBookViews);
        console.log("Book Uploads:", subjectBookUploads);
        console.log("Max Book Uploads:", maxBookUploads);
        console.log("Publication Views:", subjectPublicationViews);
        console.log("Max Publication Views:", maxPublicationViews);
        console.log("Publication Uploads:", subjectPublicationUploads);
        console.log("Max Publication Uploads:", maxPublicationUploads);
        console.log("Scores:", {
            book_view_score,
            book_uploads_score,
            publication_view_score,
            publication_uploads_score,
        });
        console.log("Total Popularity:", popularity);
        console.log("------------------------------");

        return {
            email: popularityDto.email,
            book_v: weights.book_views * book_view_score,
            book_u: weights.book_upload * book_uploads_score,
            publication_v: weights.publication_views * publication_view_score,
            publication_u:
                weights.publication_upload * publication_uploads_score,

            popularity,
        };
    }
}
