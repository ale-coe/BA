import { Body, Controller, Put } from '@nestjs/common';
import { TrashImageService } from '../service/trash-image.service';
import { PutTrashImageDto } from '../dto/put-trash-image.dto';

@Controller('trash-image')
export class TrashImageController {
  constructor(private trashImageService: TrashImageService) {}

  @Put()
  async updateTrashImage(@Body() body: PutTrashImageDto) {
    await this.trashImageService.updateTrashImage(body);
  }
}
