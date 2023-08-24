import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { log } from 'console';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

import { errorMaker } from '../helpers/errors';

export interface ExpressMulterFileWithResolution extends Express.Multer.File {
  width: number;
  height: number;
}

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  constructor(
    private width: number,
    private height: number,
    private size: number,
    private mimetype: Array<string>,
  ) {}
  async transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    const errors = [];
    let data;
    if (!this.mimetype.includes(value.mimetype)) {
      log(this.mimetype, 'this.mimetype');
      errors.push('Wrong type', 'type');
    } else {
      data = await sharp(value.buffer).metadata();

      if (data.width !== this.width) {
        errors.push('Wrong width', 'width');
      }
      if (data.height !== this.height) {
        errors.push('Wrong height', 'height');
      }
      if (value.size > this.size) {
        errors.push('Wrong fileSize', 'fileSize');
      }
    }
    if (errors.length !== 0) {
      throw new BadRequestException(errorMaker(errors));
    }
    const newValue: ExpressMulterFileWithResolution = {
      ...value,
      width: data.width,
      height: data.height,
      originalname: randomUUID(),
    };
    return newValue;
  }
}
