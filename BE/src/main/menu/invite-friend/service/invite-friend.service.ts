import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PostInviteFriendDto } from '../dto/post-invite-friend.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InvitationEntity } from '../../../../database/entities/invitation.entity';
import { Repository } from 'typeorm';
import { EmailService } from '../../../../util/services/email/email.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InviteFriendService {
  private logger = new Logger(InviteFriendService.name);

  constructor(
    @InjectRepository(InvitationEntity)
    private readonly invitationRepo: Repository<InvitationEntity>,
    private readonly emailService: EmailService,
  ) {}

  async inviteFriend(userId: number, body: PostInviteFriendDto) {
    const invitationCode = uuidv4();
    await this.invitationRepo.save({
      invitationCode,
      invitationDate: body.invitationDate,
      userId,
    });

    try {
      await this.emailService.sendMail(
        body.email,
        'Du wurdest zu Cash4Trash eingeladen!',
        `<h1>Hallo Umweltverbesserer!</h1><p>Du wurdest zu Cash4Trash eingeladen. Klicke <a href="${process.env.URI}/auth/register?code=${invitationCode}" target=_blank>hier</a> um dich zu registrieren.</p><p>Dein Cash4Trash-Team</p>`,
      );
    } catch (error) {
      this.logger.error(`Invitation mail could not be sent: ${error}`);
      throw new InternalServerErrorException();
    }
  }
}
