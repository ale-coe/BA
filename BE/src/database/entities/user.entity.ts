import { ESource } from '@shared/source.enum';
import { EUserRoles } from '@shared/user-roles.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BoughtProductEntity } from './bought-product.entity';
import { FeedbackEntity } from './feedback.entity';
import { ImageEntity } from './image.entity';
import { InvitationEntity } from './invitation.entity';
import { PositionSharingEntity } from './position-sharing.entity';
import { SocialMediaPostEntity } from './social-media-post.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column()
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true, default: null })
  activationCode: string;

  @Column({ nullable: false, default: 0 })
  activated: number;

  @Column({
    enum: [EUserRoles.ADMIN, EUserRoles.USER],
    nullable: false,
    default: EUserRoles.USER,
  })
  userRole: EUserRoles.ADMIN | EUserRoles.USER;

  @Column({
    enum: [ESource.EMAIL, ESource.GOOGLE],
    nullable: false,
  })
  @Column()
  source: ESource.EMAIL | ESource.GOOGLE;

  @Column()
  city: string;

  @Column()
  profileImage: string;

  @Column({ nullable: false, default: 0 })
  disabled: number;

  @Column()
  connectedTwitterAccount: string;

  @Column()
  position: string;

  @Column({ nullable: false, default: 0 })
  showPosition: number;

  @Column({ default: null })
  notificationId: string | null;

  @Column({ default: null })
  placement: number | null;

  @Column({ default: null })
  placementPoints: number | null;

  @OneToMany(() => ImageEntity, (image) => image.user)
  images: ImageEntity[];

  @OneToMany(() => InvitationEntity, (invitation) => invitation.user)
  invitations: InvitationEntity[];

  @OneToMany(
    () => SocialMediaPostEntity,
    (socialMediaPost) => socialMediaPost.user,
  )
  socialMediaPosts: SocialMediaPostEntity[];

  @OneToMany(() => FeedbackEntity, (feedback) => feedback.user)
  feedback: FeedbackEntity[];

  @OneToMany(() => BoughtProductEntity, (boughtProduct) => boughtProduct.user)
  boughtProducts: BoughtProductEntity[];

  @OneToMany(
    () => PositionSharingEntity,
    (positionSharing) => positionSharing.sharedForUser,
  )
  sharedForUser: PositionSharingEntity[];

  @OneToMany(
    () => PositionSharingEntity,
    (positionSharing) => positionSharing.sharedByUser,
  )
  sharedByUser: PositionSharingEntity[];
}
