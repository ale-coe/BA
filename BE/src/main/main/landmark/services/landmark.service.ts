import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EUserRoles } from '@shared/user-roles.enum';
import { plainToInstance } from 'class-transformer';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { LandmarkTypeEntity } from '../../../../database/entities/landmark-type.entity';
import { LandmarkEntity } from '../../../../database/entities/landmark.entity';
import { PushNotificationService } from '../../../../util/services/push-notification/push-notification.service';
import { GetLandmarkQueryDto } from '../dto/get-landmark-query.dto';
import { GetLandmarkTypesQueryDto } from '../dto/get-landmark-types-query.dto';
import { PostLandmarkDto } from '../dto/post-landmark.dto';
import { PutLandmarkDto } from '../dto/put-landmark.dto';

@Injectable()
export class LandmarkService {
  constructor(
    @InjectRepository(LandmarkTypeEntity)
    private readonly landmarkTypeRepo: Repository<LandmarkTypeEntity>,
    @InjectRepository(LandmarkEntity)
    private readonly landmarkRepo: Repository<LandmarkEntity>,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  getLandmarkTypes(query: GetLandmarkTypesQueryDto) {
    return this.landmarkTypeRepo.find({
      where: {
        isEvent: query.isEvent,
      },
    });
  }

  async getLandmarks(query: GetLandmarkQueryDto, userRole: EUserRoles) {
    if (query.includeInactive && userRole !== EUserRoles.ADMIN) {
      throw new BadRequestException();
    }

    const [landmarks, count] = await this.landmarkRepo.findAndCount({
      select: {
        landmarkId: true,
        name: true,
        position: true,
        landmarkType: { label: true, landmarkTypeId: true },
        additionalInfo: true,
        showFrom: true,
        showUntil: true,
      },
      relations: { landmarkType: true },
      where: {
        landmarkType: { isEvent: query.isEvent },
        // TODO_1: should account for start of day and end of day: landmark from 7.5. - 7.5. -> 00:00 - 23:59
        ...(!query.includeInactive
          ? { showFrom: LessThan(Date.now()), showUntil: MoreThan(Date.now()) }
          : {}),
      },
      order: { landmarkId: 'DESC' },
      skip: query.skip,
      take: query.take,
    });

    const transformedLandmarks = landmarks.map((landmark) => ({
      ...landmark,
      position: JSON.parse(landmark.position),
    }));

    return [transformedLandmarks, count];
  }

  async addLandmark(body: PostLandmarkDto) {
    const landmarkEntity = plainToInstance(LandmarkEntity, body, {
      enableImplicitConversion: true,
    });
    landmarkEntity.position = JSON.stringify(body.position);
    await this.landmarkRepo.save(landmarkEntity);

    const landmark = await this.landmarkRepo.findOne({
      select: { landmarkType: { isEvent: true } },
      where: { landmarkId: landmarkEntity.landmarkId },
      relations: { landmarkType: true },
    });

    if (landmark.landmarkType.isEvent) {
      this.pushNotificationService.sendNotification({
        body: `Es wurde ein neues Event hinzugefügt: ${landmark.name}`,
        title: 'Neues Event hinzugefügt',
        url: '/main/home',
      });
    }
  }

  async updateLandmark(body: PutLandmarkDto) {
    await this.landmarkRepo.save({
      landmarkId: body.landmarkId,
      showFrom: body.showFrom,
      showUntil: body.showUntil,
    });
  }
}
