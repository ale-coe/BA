import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('socialmediaposts')
export class SocialMediaPostEntity {
  @PrimaryGeneratedColumn()
  socialMediaPostId: number;

  @Column({ nullable: false })
  userId: number;

  @Column()
  postDate: number;

  @Column()
  postId: string;

  @Column()
  postContent: string;

  @ManyToOne(() => UserEntity, (user) => user.socialMediaPosts)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
