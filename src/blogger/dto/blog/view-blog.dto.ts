import { imageBlogDto } from '../avatar/view-blog-images.dto';

export class ViewBlogDto {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
  images?: imageBlogDto;
  currentUserSubscriptionStatus?: ['Subscribed' | 'Unsubscribed' | 'None'];
  subscribersCount?: number;
}
