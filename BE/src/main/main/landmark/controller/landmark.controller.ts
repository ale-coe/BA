import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LandmarkService } from '../services/landmark.service';
import { AdminGuard } from '../../../../auth/guard/admin.guard';
import { GetLandmarkTypesQueryDto } from '../dto/get-landmark-types-query.dto';
import { PostLandmarkDto } from '../dto/post-landmark.dto';
import { GetLandmarkQueryDto } from '../dto/get-landmark-query.dto';
import { PutLandmarkDto } from '../dto/put-landmark.dto';
import { UserRole } from '../../../../auth/decorators/user-role.decorator';
import { EUserRoles } from '@shared/user-roles.enum';

@Controller('landmark')
export class LandmarkController {
  constructor(private readonly landmarkService: LandmarkService) {}

  @UseGuards(AdminGuard)
  @Get('types')
  getLandmarkTypes(@Query() query: GetLandmarkTypesQueryDto) {
    return this.landmarkService.getLandmarkTypes(query);
  }

  @Get()
  getLandmarks(
    @Query() query: GetLandmarkQueryDto,
    @UserRole() userRole: EUserRoles,
  ) {
    return this.landmarkService.getLandmarks(query, userRole);
  }

  @UseGuards(AdminGuard)
  @Put()
  async updateLandmark(@Body() body: PutLandmarkDto) {
    await this.landmarkService.updateLandmark(body);
  }

  @UseGuards(AdminGuard)
  @Post()
  async addLandmark(@Body() body: PostLandmarkDto) {
    await this.landmarkService.addLandmark(body);
  }
}
