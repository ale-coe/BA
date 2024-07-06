import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FeedbackCategoryEntity } from './feedback-category.entity';
import { FeedbackTypesEntity } from './feedback-type.entity';
import { UserEntity } from './user.entity';
import { Type } from 'class-transformer';

@Entity('feedback')
export class FeedbackEntity {
  @PrimaryGeneratedColumn()
  feedbackId: number;

  @Column()
  text: string;

  @Column({ nullable: false })
  feedbackTypeId: number;

  @Column()
  feedbackCategoryId: number;

  @Column({ asExpression: 'userId', nullable: false })
  userId: number;

  @Column()
  date: number;

  @ManyToOne(() => FeedbackTypesEntity, (feedbackType) => feedbackType.feedback)
  @JoinColumn({ name: 'feedbackTypeId' })
  feedbackType: FeedbackTypesEntity;

  @ManyToOne(
    () => FeedbackCategoryEntity,
    (feedbackCategory) => feedbackCategory.feedback,
  )
  @JoinColumn({ name: 'feedbackCategoryId' })
  @Type(() => FeedbackCategoryEntity)
  feedbackCategory: FeedbackCategoryEntity;

  @ManyToOne(() => UserEntity, (user) => user.feedback)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
