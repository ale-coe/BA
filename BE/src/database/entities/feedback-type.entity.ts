import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FeedbackEntity } from './feedback.entity';

@Entity('feedbacktypes')
export class FeedbackTypesEntity {
  @PrimaryGeneratedColumn()
  feedbackTypeId: number;

  @Column()
  label: string;

  @OneToMany(() => FeedbackEntity, (feedback) => feedback.feedbackType)
  feedback: FeedbackEntity[];
}
