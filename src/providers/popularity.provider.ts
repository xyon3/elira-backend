import { BadRequestException, Injectable } from "@nestjs/common";
import { BookRepository } from "src/books/books.repository";
import { PublicationRepository } from "src/publications/publication.repository";
import { User } from "src/users/entities/user.entity";
import { UserRepository } from "src/users/users.repository";

@Injectable()
export class PopularityProvider {
    private weights = {
        book_upload: 0.2,
        book_views: 0.2,
        publication_upload: 0.4,
        publication_views: 0.2,
    };

    constructor(
        private publicationRepository: PublicationRepository,
        private bookRepository: BookRepository,
        private userRespository: UserRepository,
    ) {}

    async execute(email?: string) {
        if (!email) {
            throw new BadRequestException("Email not supplied");
        }

        const departments = await this.userRespository.findBy({
            role: { id: 2 },
        });

        const allPublications = await Promise.all(
            departments.map((department) =>
                this.publicationRepository.findBy({
                    uploadedBy: department,
                }),
            ),
        );

        const allBooks = await Promise.all(
            departments.map((department) =>
                this.bookRepository.findBy({
                    uploadedBy: department,
                }),
            ),
        );

        const maxViewsPublications = Math.max(
            ...allPublications.flat().map((pb) => pb.viewCount),
        );
        const maxViewsBooks = Math.max(
            ...allBooks.flat().map((b) => b.viewCount),
        );

        const totalPublicationLength = allPublications.flat().length;
        const totalBookLength = allBooks.flat().length;

        const subject = departments.find(
            (department) => department?.email === email,
        );

        const subjectPublications = allPublications
            .flat()
            .filter((pb) => pb.uploadedBy.email == email);
        const subjectBooks = allBooks
            .flat()
            .filter((b) => b.uploadedBy.email == email);

        const totalSubjectPublicationViews = subjectPublications.reduce(
            (sum, pb) => pb.viewCount + sum,
            0,
        );

        const totalSubjectBookViews = subjectBooks.reduce(
            (sum, pb) => pb.viewCount + sum,
            0,
        );

        const totalSubjectBookLength = subjectBooks.length;
        const totalSubjectPublicationLength = subjectPublications.length;

        const booksViewScore = totalSubjectBookViews / maxViewsBooks;
        const publicationViewScore =
            totalSubjectPublicationViews / maxViewsPublications;

        const publicationUploadsScore =
            totalSubjectPublicationLength / totalPublicationLength;
        const bookUploadsScore = totalSubjectBookLength / totalBookLength;

        const safe = (value: any): number =>
            Number.isFinite(value) ? value : 0;

        const book_v = safe(this.weights.book_views) * safe(booksViewScore);
        const book_u = safe(this.weights.book_upload) * safe(bookUploadsScore);
        const publication_v =
            safe(this.weights.publication_views) * safe(publicationViewScore);
        const publication_u =
            safe(this.weights.publication_upload) *
            safe(publicationUploadsScore);

        return {
            email,
            book_v,
            book_u,
            publication_v,
            publication_u,
            popularity: book_v + book_u + publication_v + publication_u,
            totals: {
                totalSubjectPublicationLength,
                totalSubjectPublicationViews,
                totalSubjectBookLength,
                totalSubjectBookViews,
            },
        };
    }
}
