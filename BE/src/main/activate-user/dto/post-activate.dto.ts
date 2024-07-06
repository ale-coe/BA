import { IPostActivateAttributes } from '@shared/post-activate.attributes';
import { IsUUID } from 'class-validator';

export class PostActivateDto implements IPostActivateAttributes {
  @IsUUID(4)
  activationCode: string;
}
