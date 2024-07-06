import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AmountEntity } from './amount.entity';
import { CategoryEntity } from './category.entity';
import { UserEntity } from './user.entity';

@Entity('images')
export class ImageEntity {
  @PrimaryGeneratedColumn()
  imageId: number;

  @Column({ nullable: false })
  uploadDate: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  name: string;

  @Column()
  categoryId: number;

  @Column()
  amountId: number;

  @Column({ nullable: false, default: 1 })
  hidden: number;

  @ManyToOne(() => CategoryEntity, (category) => category.images)
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @ManyToOne(() => AmountEntity, (amount) => amount.images)
  @JoinColumn({ name: 'amountId' })
  amount: AmountEntity;

  @ManyToOne(() => UserEntity, (user) => user.images)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
