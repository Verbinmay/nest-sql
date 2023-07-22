import {
  banStatusVariates,
  publishedStatusVariates,
  sortDirectionVariates,
  sortingByVariates,
} from './paginatorType';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, Validate } from 'class-validator';

import { ValidationSortBy } from '../validation/validationSortBy';

export class BasicPagination {
  @IsOptional()
  @Transform(({ value }) => containsOnlyOneNumber(value))
  pageNumber = 1;

  @IsOptional()
  @Transform(({ value }) => containsOnlyOneNumber(value))
  pageSize = 10;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  @IsIn(sortingByVariates, {
    message: ' sort filter not exist',
  })
  sortBy = 'createdAt';

  @IsOptional()
  @Validate(ValidationSortBy)
  @Transform(({ value }) => sortTransformer(value))
  sort = ['avgScores desc', 'sumScore desc'];

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  @IsIn(sortDirectionVariates, {
    message: ' sort direction must be asc or desc',
  })
  sortDirection: 'ASC' | 'DESC' = 'DESC';

  public skip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
  public countPages(totalCount: number) {
    return Math.ceil(totalCount / this.pageSize);
  }
}

export class PaginationQuery extends BasicPagination {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => containsOnlyOneWord(value))
  searchNameTerm = '';
  @IsString()
  @IsOptional()
  @Transform(({ value }) => containsOnlyOneWord(value))
  bodySearchTerm = '';
  @IsString()
  @IsOptional()
  @Transform(({ value }) => containsOnlyOneWord(value))
  searchLoginTerm = '';
  @IsString()
  @IsOptional()
  @Transform(({ value }) => containsOnlyOneWord(value))
  searchEmailTerm = '';
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  @IsIn(banStatusVariates, {
    message: ' ban status not exist',
  })
  banStatus: 'all' | 'banned' | 'notBanned' = 'all';
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  @IsIn(publishedStatusVariates, {
    message: ' ban status not exist',
  })
  publishedStatus: 'all' | 'published' | 'notPublished' = 'all';

  public createBanStatus() {
    switch (this.banStatus) {
      case 'all':
        return [true, false];
      case 'banned':
        return [true];
      case 'notBanned':
        return [false];
    }
  }
  public createPublishedStatus() {
    switch (this.publishedStatus) {
      case 'all':
        return [true, false];
      case 'published':
        return [true];
      case 'notPublished':
        return [false];
    }
  }
}

function sortTransformer(value): string | Array<string> {
  if (typeof value === 'string') {
    return [value];
  } else return value;
}
function containsOnlyOneNumber(value): number {
  const pageNumber = parseInt(value);
  if (isNaN(pageNumber)) return 1;
  return pageNumber;
}

function containsOnlyOneWord(str): string {
  const characters = str.split('');
  const indices = [];

  for (let i = 0; i < characters.length; i++) {
    const regex = /^[^\w\s]+$/;

    if (!regex.test(characters[i])) {
      indices.push(characters[i]);
    }
  }

  return indices.join('');
}
