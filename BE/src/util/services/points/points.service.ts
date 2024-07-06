import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { UserEntity } from '../../../database/entities/user.entity';
import { DataSource, IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async getCurrentBalance(userId: number) {
    const query = `
    SELECT
    COALESCE(
        (
            SELECT
                SUM(invitationSuccessful * 5)
            FROM
                invitations i
            WHERE
                i.userid = u.userid
        ),
        0
    ) + COALESCE(
        (
            SELECT
                count(*)
            FROM
                SOCIALMEDIAPOSTS smp
            WHERE
                smp.userId = u.userid
        ),
        0
    ) + COALESCE(
        (
            SELECT
                SUM(c.points + a.points)
            FROM
                IMAGES i
                INNER JOIN CATEGORIES c ON i.categoryId = c.categoryId
                INNER JOIN AMOUNTS a ON i.amountId = a.amountId
            WHERE
                i.userId = u.userId
        ),
        0
    ) - COALESCE(
        (
            SELECT
                SUM(p.price)
            FROM
                BOUGHTPRODUCTS bp
                INNER JOIN PRODUCTS p ON bp.productId = p.productId
            WHERE
                bp.userId = u.userId
        ),
        0
    ) AS points
FROM
    users u
WHERE
    u.userid = ?;
    `;

    const result = await this.dataSource.query(query, [userId]);

    if (!result.length) {
      throw new BadRequestException();
    }

    return result[0].points;
  }

  async getCurrentMonthsPoints(userId: number) {
    const query = `
    SELECT
    COALESCE(
        (
            SELECT SUM(invitationSuccessful * 5) FROM invitations i
            WHERE
                i.userid = u.userid
                AND i.invitationDate >= STRFTIME('%s', DATE('now', 'start of month')) * 1000
                AND i.invitationDate < STRFTIME('%s', DATE('now', 'start of month', '+1 Month')) * 1000
        ),
        0
    ) + COALESCE(
        (
            SELECT count(*) FROM SOCIALMEDIAPOSTS smp
            WHERE
                smp.userId = u.userid
                AND smp.postDate >= STRFTIME('%s', DATE('now', 'start of month')) * 1000
                AND smp.postDate < STRFTIME('%s', DATE('now', 'start of month', '+1 Month')) * 1000
        ),
        0
    ) + COALESCE(
        (
            SELECT SUM(c.points + a.points) FROM IMAGES i
            INNER JOIN CATEGORIES c ON i.categoryId = c.categoryId
            INNER JOIN AMOUNTS a ON i.amountId = a.amountId
            WHERE
                i.userId = u.userId
                AND i.uploadDate >= STRFTIME('%s', DATE('now', 'start of month')) * 1000
                AND i.uploadDate < STRFTIME('%s', DATE('now', 'start of month', '+1 Month')) * 1000
        ),
        0
    ) AS points
FROM
    users u
WHERE
    u.userId = ?;`;

    const result = await this.dataSource.query(query, [userId]);
    return result[0].points;
  }

  async getRankingForDailyUpdate() {
    const query = `SELECT u.userid,
    COALESCE(
        (SELECT SUM(invitationSuccessful * 5) FROM invitations i
            WHERE i.userid = u.userid
            AND i.invitationDate >= STRFTIME('%s', DATE('now', 'start of month')) * 1000
            AND i.invitationDate < STRFTIME('%s', DATE('now', 'start of month', '+1 Month')) * 1000),
        0
    ) + COALESCE(
        (SELECT count(*) FROM SOCIALMEDIAPOSTS smp
        WHERE smp.userId = u.userid
            AND smp.postDate >= STRFTIME('%s', DATE('now', 'start of month')) * 1000
            AND smp.postDate < STRFTIME('%s', DATE('now', 'start of month', '+1 Month')) * 1000),
        0
    ) + COALESCE(
        (SELECT SUM(c.points + a.points) FROM IMAGES i
        INNER JOIN CATEGORIES c ON i.categoryId = c.categoryId
        INNER JOIN AMOUNTS a ON i.amountId = a.amountId
        WHERE i.userId = u.userId
            AND i.uploadDate >= STRFTIME('%s', DATE('now', 'start of month')) * 1000
            AND i.uploadDate < STRFTIME('%s', DATE('now', 'start of month', '+1 Month')) * 1000),
        0
    ) AS placementPoints FROM users u ORDER BY placementPoints DESC, u.email ASC`;

    const result =
      await this.dataSource.query<
        { userId: number; placement: number; placementPoints: number }[]
      >(query);

    for (let i = 0; i < result.length; i++) {
      if (!i) {
        result[i].placement = 1;
        continue;
      }

      result[i].placement =
        result[i].placementPoints === result[i - 1].placementPoints
          ? result[i - 1].placement
          : result[i - 1].placement + 1;
    }

    return result;
  }

  async getRanking(pagination: PaginationDto) {
    return this.userRepo.findAndCount({
      select: {
        userId: true,
        city: true,
        username: true,
        profileImage: true,
        placement: true,
        placementPoints: true,
      },
      where: { placement: Not(IsNull()) },
      order: { placement: 'ASC', email: 'ASC' },
      skip: pagination.skip,
      take: pagination.take,
    });
  }
}
