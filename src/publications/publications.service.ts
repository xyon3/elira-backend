import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreatePublicationDto } from "./dto/create-publication.dto";
import { UpdatePublicationDto } from "./dto/update-publication.dto";
import { UserRepository } from "src/users/users.repository";
import { Publication } from "./entities/publication.entity";
import { PublicationRepository } from "./publication.repository";
import { FindOptionsOrder, ILike } from "typeorm";

@Injectable()
export class PublicationsService {
    constructor(
        protected readonly publicationRepository: PublicationRepository,
        protected readonly userRepository: UserRepository,
    ) {}

    async create(
        createPublicationDto: CreatePublicationDto,
    ): Promise<Publication> {
        const uploader = await this.userRepository.findBy({
            email: createPublicationDto.uploader,
        });

        if (uploader.length === 0) {
            throw new NotFoundException("user does not exist");
        }

        return this.publicationRepository.save({
            ...createPublicationDto,
            viewCount: 0,
            uploadedBy: uploader[0],
        });
    }

    async findAll(
        isPaginated: number = 1,
        page: number = 1,
        limit: number = 10,
        randomize: number = 0,
        search?: string,
    ) {
        let order: FindOptionsOrder<Publication> = {
            uploadDate: "desc",
        };

        if (randomize) {
            order = {
                id: "desc",
            };
        }
        console.log(order);

        if (isPaginated) {
            const [data, total] = await this.publicationRepository.findAndCount(
                {
                    where: search
                        ? [
                              { title: ILike(`%${search}%`) }, // adjust to your column
                              { description: ILike(`%${search}%`) }, // add other fields as needed
                          ]
                        : undefined,
                    order,
                    skip: (page - 1) * limit,
                    take: limit,
                },
            );

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

        return this.publicationRepository.find({
            order: {
                uploadDate: "desc",
            },
        });
    }

    async findOne(id: string): Promise<Publication | null> {
        return this.publicationRepository.findOneBy({ id });
    }

    async update(id: string, updatePublicationDto: UpdatePublicationDto) {
        const publication = await this.publicationRepository.findOneBy({ id });

        if (publication == null) {
            throw new BadRequestException("Publication does not exist");
        }

        const updatedPublication = {
            id: updatePublicationDto.prefixID
                ? updatePublicationDto.prefixID
                : publication.prefixID,
            title: updatePublicationDto.title
                ? updatePublicationDto.title
                : publication.title,
            description: updatePublicationDto.description
                ? updatePublicationDto.description
                : publication.description,
            path: updatePublicationDto.path
                ? updatePublicationDto.path
                : publication.path,
            filename: updatePublicationDto.filename
                ? updatePublicationDto.filename
                : publication.filename,
            prefixID: updatePublicationDto.prefixID
                ? updatePublicationDto.prefixID
                : publication.prefixID,
            degree: updatePublicationDto.degree
                ? updatePublicationDto.degree
                : publication.degree,
            uploadDate: updatePublicationDto.uploadDate
                ? updatePublicationDto.uploadDate
                : publication.uploadDate,
            issueDate: updatePublicationDto.issueDate
                ? updatePublicationDto.issueDate
                : publication.issueDate,
            authors: updatePublicationDto.authors
                ? updatePublicationDto.authors
                : publication.authors,
        };

        console.log(updatedPublication);

        await this.publicationRepository.update(id, updatedPublication);
        return this.publicationRepository.findOneBy({ id });
    }

    async remove(id: string): Promise<void> {
        await this.publicationRepository.delete(id);
    }
}
