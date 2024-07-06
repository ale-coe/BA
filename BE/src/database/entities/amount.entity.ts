import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ImageEntity } from './image.entity';

@Entity('amounts')
export class AmountEntity {
  @PrimaryGeneratedColumn()
  amountId: number;

  @Column()
  label: string;

  @Column({ nullable: false })
  points: number;

  @OneToMany(() => ImageEntity, (image) => image.amount)
  images: ImageEntity[];
}
