import { Injectable, NotFoundException } from "@nestjs/common";
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
            id: createPublicationDto.uploader,
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
        await this.publicationRepository.update(id, updatePublicationDto);
        return this.publicationRepository.findOneBy({ id });
    }

    async remove(id: string): Promise<void> {
        await this.publicationRepository.delete(id);
    }
}
