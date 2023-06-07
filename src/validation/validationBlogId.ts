import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

import { BlogRepository } from '../sql/blog.repository';

@ValidatorConstraint({ name: 'ValidationBlogId', async: true })
@Injectable()
export class ValidationBlogId implements ValidatorConstraintInterface {
  constructor(private readonly blogRepository: BlogRepository) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(blogId: string, args: ValidationArguments) {
    const blog = await this.blogRepository.findBlogById(blogId);

    if (blog === null) return false;
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return 'blogId not exist!';
  }
}
