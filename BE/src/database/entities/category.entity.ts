import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ImageEntity } from './image.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column()
  label: string;

  @Column({ nullable: false })
  points: number;

  @OneToMany(() => ImageEntity, (image) => image.category)
  images: ImageEntity[];
}
