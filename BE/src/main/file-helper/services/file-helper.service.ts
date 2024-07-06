import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync, writeFileSync } from 'fs';
import { ImageEntity } from '../../../database/entities/image.entity';
import { UserEntity } from '../../../database/entities/user.entity';
import { QueueService } from '../../../util/services/queue/queue.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PaginationDto } from '../../../shared/dto/pagination.dto';

@Injectable()
export class FileHelperService {
  private logger = new Logger(FileHelperService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(ImageEntity)
    private readonly imageRepo: Repository<ImageEntity>,
    private readonly queueService: QueueService,
  ) {}

  async getImage(scope: string, name: string) {
    try {
      switch (scope) {
        case 'profileImage':
          return readFileSync(
            `${process.env.FILES_PROFILE_IMAGES}/${name}`,
          ).toString('base64');
        case 'trashImage':
          return readFileSync(
            `${process.env.FILES_TRASH_IMAGES}/${name}`,
          ).toString('base64');
        case 'productImage':
          return readFileSync(
            `${process.env.FILES_PRODUCT_IMAGES}/${name}`,
          ).toString('base64');
      }
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException();
    }

    throw new BadRequestException();
  }

  getImages(scope: string, pagination: PaginationDto) {
    switch (scope) {
      case 'trashImage':
        return this.imageRepo.findAndCount({
          select: {
            uploadDate: true,
            name: true,
            imageId: true,
            hidden: true,
            user: {
              username: true,
              email: true,
            },
          },
          relations: { user: true },
          skip: pagination.skip,
          take: pagination.take,
          order: { uploadDate: 'DESC' },
        });
    }

    throw new BadRequestException();
  }

  async postImage(scope: string, userId: number, file: Express.Multer.File) {
    switch (scope) {
      case 'profileImage': {
        const filename = this.writeFileToDisk(
          file,
          process.env.FILES_PROFILE_IMAGES,
        );
        await this.userRepo.save({ userId, profileImage: filename });

        return filename;
      }
      case 'trashImage': {
        const filename = this.writeFileToDisk(
          file,
          process.env.FILES_TRASH_IMAGES,
        );

        const entity = await this.imageRepo.save({
          userId,
          uploadDate: Date.now(),
          name: filename,
        });

        this.queueService.addToQueue(userId, entity.imageId, file);

        return filename;
      }
      case 'productImage': {
        const filename = this.writeFileToDisk(
          file,
          process.env.FILES_PRODUCT_IMAGES,
        );

        return filename;
      }
      default:
        throw new BadRequestException();
    }
  }

  writeFileToDisk(file: Express.Multer.File, path: string) {
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
    );
    const filename = `${uuidv4()}${extension}`;

    writeFileSync(`${path}/${filename}`, file.buffer);
    return filename;
  }
}
