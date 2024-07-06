import { Body, Controller, Post } from '@nestjs/common';
import { PostInviteFriendDto } from '../dto/post-invite-friend.dto';
import { InviteFriendService } from '../service/invite-friend.service';
import { UserId } from '../../../../auth/decorators/user-id.decorator';

@Controller('invite-friend')
export class InviteFriendController {
  constructor(private readonly inviteFriendService: InviteFriendService) {}

  @Post()
  async inviteFriendController(
    @UserId() userId: number,
    @Body() body: PostInviteFriendDto,
  ) {
    await this.inviteFriendService.inviteFriend(userId, body);
  }
}
