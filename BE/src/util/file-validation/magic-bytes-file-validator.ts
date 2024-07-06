import { FileValidator, Logger } from '@nestjs/common';

enum EMagicBytes {
  WEBP = '52494646',
  PNG = '89504E47',
  JPEG1 = 'FFD8FFE0',
  JPEG2 = 'FFD8FFE1',
}

export class MagicBytesFileValidator extends FileValidator {
  private logger = new Logger(MagicBytesFileValidator.name);

  isValid(file: Express.Multer.File): boolean {
    const magicBytes = file.buffer.subarray(0, 4).toString('hex');

    if (
      !(
        [
          EMagicBytes.WEBP,
          EMagicBytes.PNG,
          EMagicBytes.JPEG1,
          EMagicBytes.JPEG2,
        ] as string[]
      ).includes(magicBytes.toUpperCase())
    ) {
      return false;
    }

    return true;
  }
  buildErrorMessage(): string {
    this.logger.error('Invalid file format');
    return 'Falsches Format';
  }
}
