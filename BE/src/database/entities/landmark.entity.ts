import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LandmarkTypeEntity } from './landmark-type.entity';
import { Type } from 'class-transformer';

@Entity('landmarks')
export class LandmarkEntity {
  @PrimaryGeneratedColumn()
  landmarkId: number;

  @Column({ nullable: false })
  landmarkTypeId: number;

  @Column()
  name: string;

  @Column()
  position: string;

  @Column()
  showFrom: number;

  @Column()
  showUntil: number;

  @Column()
  additionalInfo: string;

  @ManyToOne(() => LandmarkTypeEntity, (landmarkType) => landmarkType.landmarks)
  @JoinColumn({ name: 'landmarkTypeId' })
  @Type(() => LandmarkTypeEntity)
  landmarkType: LandmarkTypeEntity;
}
