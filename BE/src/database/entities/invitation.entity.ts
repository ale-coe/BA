import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('invitations')
export class InvitationEntity {
  @PrimaryGeneratedColumn()
  invitationId: number;

  @Column()
  invitationCode: string;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false, default: 0 })
  invitationSuccessful: number;

  @Column()
  invitationDate: number;

  @ManyToOne(() => UserEntity, (user) => user.invitations)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
