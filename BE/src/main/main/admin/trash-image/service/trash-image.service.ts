import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from '../../../../../database/entities/image.entity';
import { Repository } from 'typeorm';
import { PutTrashImageDto } from '../dto/put-trash-image.dto';

@Injectable()
export class TrashImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepo: Repository<ImageEntity>,
  ) {}

  updateTrashImage({ imageId, hidden }: PutTrashImageDto) {
    return this.imageRepo.save({ imageId, hidden });
  }
}
