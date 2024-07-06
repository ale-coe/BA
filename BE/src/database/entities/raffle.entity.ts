import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('raffles')
export class RaffleEntity {
  @PrimaryGeneratedColumn()
  raffleId: number;

  @Column()
  description: string;

  @Column({ nullable: false })
  startDate: number;

  @Column({ nullable: false })
  endDate: number;

  @Column({ nullable: false, default: 0 })
  stopped: number;

  @Column()
  productId: number;

  @ManyToOne(() => ProductEntity, (product) => product.raffles)
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;
}
