import { TPaginated } from 'src/app/common/interfaces/paginated.type';

interface IFeedImage {
  imageId: number;
  type: 'image';
  uploadDate: number;
  name: string;
  category: {
    label: string;
  };
  amount: {
    label: string;
  };
  user: { username: string } | null;
}

interface ISocialMediaPost {
  socialMediaPostId: number;
  type: 'socialMediaPost';
  postDate: number;
  postContent: string;
  user: { username: string } | null;
}

export type TFeedItem = IFeedImage | ISocialMediaPost;

export type TPaginatedFeed = TPaginated<TFeedItem[]>;
