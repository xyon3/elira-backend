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

    async findAll(): Promise<Publication[]> {
        return this.publicationRepository.find();
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
        };

        await this.publicationRepository.update(id, updatedPublication);
        return this.publicationRepository.findOneBy({ id });
    }

    async remove(id: string): Promise<void> {
        await this.publicationRepository.delete(id);
    }
}
