import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';

@Entity('boughtproducts')
export class BoughtProductEntity {
  @PrimaryGeneratedColumn()
  boughtProductId: number;

  @Column({ nullable: false })
  productId: number;

  @Column({ nullable: false })
  userId: number;

  @Column()
  date: number;

  @ManyToOne(() => UserEntity, (user) => user.boughtProducts)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.boughtProducts)
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;
}
