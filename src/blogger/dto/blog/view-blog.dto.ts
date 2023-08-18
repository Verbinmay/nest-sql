import { imageDto } from '../avatar/view-avatar.dto';

export class ViewBlogDto {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
  images?: imageDto;
}
