import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { Book } from "./entities/book.entity";
import { CreateBookDto } from "./dto/create-book.dto";
import { BookRepository } from "./books.repository";
import { UserRepository } from "src/users/users.repository";
import { UpdateBookDto } from "./dto/update-book.dto";
import { FindOptionsOrder } from "typeorm";
import { ShelfRepository } from "src/shelf.repository/shelf.repository";

@Injectable()
export class BooksService {
    constructor(
        protected readonly bookRepository: BookRepository,
        protected readonly userRepository: UserRepository,
        protected readonly shelfRepository: ShelfRepository,
    ) {}

    async create(createBookDto: CreateBookDto) {
        const uploader = await this.userRepository.findBy({
            email: createBookDto.uploader,
        });
        console.log(uploader);

        if (uploader.length === 0) {
            throw new NotFoundException("user does not exist");
        }

        const defaultShelf = await this.shelfRepository.findOneBy({
            _id: "default",
        });

        if (defaultShelf) {
            return this.bookRepository.save({
                ...createBookDto,
                viewCount: 0,
                uploadedBy: uploader[0],
                shelf: defaultShelf,
            });
        }
    }

    async findAll(
        isPaginated: number = 1,
        page: number = 1,
        limit: number = 10,
        randomize: number = 0,
    ) {
        let order: FindOptionsOrder<Book> = {
            uploadDate: "desc",
        };

        if (randomize) {
            order = {
                id: "desc",
            };
        }

        if (isPaginated) {
            const [data, total] = await this.bookRepository.findAndCount({
                order,
                skip: (page - 1) * limit,
                take: limit,
            });

            return {
                data,
                meta: {
                    total,
                    page,
                    limit,
                    lastPage: Math.ceil(total / limit),
                },
            };
        }

        return this.bookRepository.find({
            order: {
                uploadDate: "desc",
            },
        });
    }

    async findOne(id: string): Promise<Book | null> {
        return this.bookRepository.findOneBy({ id });
    }

    async update(id: string, updateBookDto: UpdateBookDto) {
        const book = await this.bookRepository.findOneBy({ id });

        if (book == null) {
            throw new BadRequestException("Book does not exist");
        }

        const updatedBook = {
            id: updateBookDto.prefixID ? updateBookDto.prefixID : book.prefixID,
            title: updateBookDto.title ? updateBookDto.title : book.title,
            description: updateBookDto.description
                ? updateBookDto.description
                : book.description,
            path: updateBookDto.path ? updateBookDto.path : book.path,
            filename: updateBookDto.filename
                ? updateBookDto.filename
                : book.filename,
            prefixID: updateBookDto.prefixID
                ? updateBookDto.prefixID
                : book.prefixID,
            uploadDate: updateBookDto.uploadDate
                ? updateBookDto.uploadDate
                : book.uploadDate,
        };

        await this.bookRepository.update(id, updatedBook);
        return this.bookRepository.findOneBy({ id });
    }

    async remove(id: string): Promise<void> {
        await this.bookRepository.delete(id);
    }
}
