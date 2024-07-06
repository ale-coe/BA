import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FeedbackEntity } from './feedback.entity';

@Entity('feedbackcategories')
export class FeedbackCategoryEntity {
  @PrimaryGeneratedColumn()
  feedbackCategoryId: number;

  @Column()
  label: string;

  @OneToMany(() => FeedbackEntity, (feedback) => feedback.feedbackCategory)
  feedback: FeedbackEntity[];
}
