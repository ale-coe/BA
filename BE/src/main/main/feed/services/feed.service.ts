import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { ImageEntity } from '../../../../database/entities/image.entity';
import { SocialMediaPostEntity } from '../../../../database/entities/social-media-post.entity';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepo: Repository<ImageEntity>,
    @InjectRepository(SocialMediaPostEntity)
    private readonly socialMediaPostRepo: Repository<SocialMediaPostEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async getFeed(body: PaginationDto) {
    const countQuery = `
    SELECT
    COUNT(*) as count
FROM
    (
        SELECT
            imageid AS id,
            uploaddate AS date,
            'images' AS source
        FROM
            images
        WHERE hidden = 0
        UNION
        SELECT
            socialMediaPostId AS id,
            postDate AS date,
            'socialMediaPosts' AS source
        FROM
            SOCIALMEDIAPOSTS
    ) AS t;
    `;
    const countResult =
      await this.dataSource.query<{ count: number }[]>(countQuery);

    const dataQuery = `SELECT
    *
FROM
    (
        SELECT
            imageid AS id,
            uploaddate AS date,
            'images' AS source
        FROM
            images
        WHERE hidden = 0
        UNION
        SELECT
            socialMediaPostId AS id,
            postDate AS date,
            'socialMediaPosts' AS source
        FROM
            SOCIALMEDIAPOSTS
    ) AS t
    ORDER BY
        date DESC
    LIMIT ?
    OFFSET ?
    `;

    const dataResult = await this.dataSource.query<
      { id: number; date: number; source: string }[]
    >(dataQuery, [body.take, body.skip]);

    const imageIds = dataResult
      .filter(({ source }) => source === 'images')
      .map(({ id }) => id);
    let images: ImageEntity[] = imageIds.length
      ? await this.imageRepo.find({
          select: {
            imageId: true,
            uploadDate: true,
            name: true,
            category: { label: true },
            amount: { label: true },
            user: { username: true },
          },
          where: { imageId: In(imageIds) },
          relations: { category: true, amount: true, user: true },
        })
      : [];

    const socialMediaPostIds = dataResult
      .filter(({ source }) => source === 'socialMediaPosts')
      .map(({ id }) => id);
    let socialMediaPosts: SocialMediaPostEntity[] = socialMediaPostIds.length
      ? await this.socialMediaPostRepo.find({
          select: {
            socialMediaPostId: true,
            postContent: true,
            postDate: true,
            user: { username: true },
          },
          where: { socialMediaPostId: In(socialMediaPostIds) },
          relations: { user: true },
        })
      : [];

    const feedData = dataResult.map(({ id, source }) => {
      if (source === 'images') {
        return {
          type: 'image',
          ...images.find(({ imageId }) => imageId === id),
        };
      } else {
        return {
          type: 'socialMediaPost',
          ...socialMediaPosts.find(
            ({ socialMediaPostId }) => socialMediaPostId === id,
          ),
        };
      }
    });

    return [feedData, countResult[0].count];
  }
}
