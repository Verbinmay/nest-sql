import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdatePublishedDto {
  @IsNotEmpty()
  @IsBoolean()
  published: boolean;
}
