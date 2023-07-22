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

@ValidatorConstraint({ name: 'ValidationSortBy', async: true })
@Injectable()
export class ValidationSortBy implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(sort: string | Array<string>, args: ValidationArguments) {
    if (typeof sort === 'string') {
      return validateSortString(sort);
    } else if (Array.isArray(sort)) {
      for (const s of sort) {
        return validateSortString(s);
      }
    } else return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return 'sort not exist!';
  }
}

function validateSortString(s: string) {
  const sortString = s.split(' ');

  if (
    sortString.length !== 2 ||
    sortingByVariates.includes(sortString[0]) === false ||
    sortDirectionVariates.includes(sortString[1].toLocaleUpperCase()) === false
  ) {
    return false;
  }
  return true;
}
