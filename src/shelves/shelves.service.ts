import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateShelfDto } from "./dto/create-shelf.dto";
import { ShelfRepository } from "src/shelf.repository/shelf.repository";
import { BookRepository } from "src/books/books.repository";

@Injectable()
export class ShelvesService {
    constructor(
        private shelfRepository: ShelfRepository,
        private bookRepository: BookRepository,
    ) {}

    create(createShelfDto: CreateShelfDto) {
        this.shelfRepository.save({ ...createShelfDto });
        return "This action adds a new shelf";
    }

    async findAll(max: number = 5) {
        const shelves = await this.shelfRepository.find({
            relations: ["books"],
        });

        const limitedShelf = shelves.map((shelf) => {
            const books = shelf.books.slice(0, 5);

            console.log(books);

            return {
                ...shelf,
                books,
            };
        });

        return limitedShelf;
    }

    async findAllShelfID() {
        const allShelf = await this.shelfRepository.find();

        const idOnly = allShelf.map((shelf) => shelf._id);

        return { idOnly };
    }

    findOne(id: string) {
        return this.shelfRepository.findBy({ _id: id });
    }

    async addBook(id: string, bookID: string) {
        const foundShelf = await this.shelfRepository.findOneBy({ _id: id });

        if (!foundShelf) {
            throw new NotFoundException("Shelf does not exist");
        }

        const foundBook = await this.bookRepository.findOneBy({ id: bookID });

        if (!foundBook) {
            throw new NotFoundException("Book does not exist");
        }

        this.bookRepository.update(foundBook.id, {
            ...foundBook,
            shelf: foundShelf,
        });

        return { msg: "shelf update successful" };
    }

    async removeBook(id: string, bookID: string) {
        const foundShelf = await this.shelfRepository.findOneBy({ _id: id });

        if (!foundShelf) {
            throw new NotFoundException("Shelf does not exist");
        }

        const foundBook = await this.bookRepository.findOneBy({ id: bookID });

        if (!foundBook) {
            throw new NotFoundException("Book does not exist");
        }

        const defaultShelf = await this.shelfRepository.findOneBy({
            _id: "default",
        });

        if (defaultShelf) {
            this.bookRepository.update(foundBook.id, {
                ...foundBook,
                shelf: defaultShelf,
            });
        }

        return { msg: "shelf update successful" };
    }

    async remove(id: string) {
        const foundShelf = await this.shelfRepository.findOneBy({ _id: id });

        if (!foundShelf) {
            throw new NotFoundException("Shelf does not exist");
        }

        if (foundShelf.books.length > 0) {
            throw new ForbiddenException("Remove all books first");
        }

        this.shelfRepository.delete({ _id: id });

        return { msg: "shelf has been removed" };
    }
}
