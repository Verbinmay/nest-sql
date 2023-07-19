import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import {
  sortDirectionVariates,
  sortingByVariates,
} from '../pagination/paginatorType';
import { Injectable } from '@nestjs/common';

import { BlogRepository } from '../sql/blog.repository';

@ValidatorConstraint({ name: 'ValidationSortBy', async: true })
@Injectable()
export class ValidationSortBy implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(sort: string | Array<string>, args: ValidationArguments) {
    if (typeof sort === 'string') {
      return sortingByVariates.includes(sort);
    } else if (Array.isArray(sort)) {
      for (const s of sort) {
        const array = s.split(' ');

        if (
          array.length !== 2 ||
          sortingByVariates.includes(array[0].toLocaleLowerCase()) === false ||
          sortDirectionVariates.includes(array[1].toLocaleUpperCase()) === false
        ) {
          return false;
        }
      }
      return true;
    } else return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return 'sort not exist!';
  }
}
