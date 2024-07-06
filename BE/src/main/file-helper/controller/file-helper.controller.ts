import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageSize } from 'image-size';
import { UserId } from '../../../auth/decorators/user-id.decorator';
import { AdminGuard } from '../../../auth/guard/admin.guard';
import { MagicBytesFileValidator } from '../../../util/file-validation/magic-bytes-file-validator';
import { PaginationDto } from '../../../shared/dto/pagination.dto';
import { FileHelperService } from '../services/file-helper.service';

@Controller('file-helper')
export class FileHelperController {
  constructor(private readonly fileHelperService: FileHelperService) {}

  @UseGuards(AdminGuard)
  @Get('/:scope')
  async getImages(
    @Param('scope') scope: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.fileHelperService.getImages(scope, pagination);
  }

  @Get('/:scope/:name')
  async getImage(@Param('scope') scope: string, @Param('name') name: string) {
    return this.fileHelperService.getImage(scope, name);
  }

  @Post('/:scope')
  @UseInterceptors(FileInterceptor('file'))
  postImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MagicBytesFileValidator({})],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Param('scope') scope: string,
    @UserId() userId: number,
  ) {
    const { height, width } = imageSize(file.buffer);
    if (
      (scope === 'profileImage' || scope === 'productImage') &&
      height !== width
    ) {
      throw new BadRequestException();
    }
    return this.fileHelperService.postImage(scope, userId, file);
  }
}
