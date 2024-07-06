import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('positionsharing')
@Unique(['sharedByUserId', 'sharedForUserId'])
export class PositionSharingEntity {
  @PrimaryGeneratedColumn()
  positionSharingId: number;

  @Column({ nullable: false })
  sharedByUserId: number;

  @Column({ nullable: false })
  sharedForUserId: number;

  @ManyToOne(() => UserEntity, (user) => user.sharedByUser)
  @JoinColumn({ name: 'sharedByUserId' })
  sharedByUser: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.sharedForUser)
  @JoinColumn({ name: 'sharedForUserId' })
  sharedForUser: UserEntity;
}
