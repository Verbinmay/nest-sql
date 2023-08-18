import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import sharp from 'sharp';

import { errorMaker } from '../helpers/errors';

@Injectable()
export class wallpaperValidationPipe implements PipeTransform {
  async transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    const data = await sharp(value.buffer).metadata();
    const errors = [];

    if (data.width !== 1028) {
      errors.push('Wrong width', 'width');
    }
    if (data.height !== 312) {
      errors.push('Wrong height', 'height');
    }
    if (value.size > 100000) {
      errors.push('Wrong fileSize', 'fileSize');
    }

    if (value.mimetype !== ('image/jpg' || 'image/jpeg' || 'image/png')) {
      errors.push('Wrong type', 'type');
    }
    if (errors.length !== 0) {
      throw new BadRequestException(errorMaker(errors));
    }
    return value;
  }
}
