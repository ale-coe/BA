import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BoughtProductEntity } from './bought-product.entity';
import { RaffleEntity } from './raffle.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column()
  name: string;

  @Column()
  imagePath: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  hidden: number;

  @OneToMany(
    () => BoughtProductEntity,
    (boughtProduct) => boughtProduct.product,
  )
  boughtProducts: BoughtProductEntity[];

  @OneToMany(() => RaffleEntity, (raffle) => raffle.product)
  raffles: RaffleEntity[];
}
