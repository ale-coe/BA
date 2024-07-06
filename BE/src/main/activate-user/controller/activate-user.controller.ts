import { Body, Controller, Post } from '@nestjs/common';
import { UserId } from '../../../auth/decorators/user-id.decorator';
import { PostActivateDto } from '../../../main/activate-user/dto/post-activate.dto';
import { ActivateUserService } from '../services/activate-user.service';

@Controller('activate-user')
export class ActivateUserController {
  constructor(private readonly activateUserService: ActivateUserService) {}

  @Post()
  async activateUser(@Body() body: PostActivateDto, @UserId() userId: number) {
    await this.activateUserService.activateUser(body, userId);
    return true;
  }
}
