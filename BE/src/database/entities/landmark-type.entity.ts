import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LandmarkEntity } from './landmark.entity';

@Entity('landmarktypes')
export class LandmarkTypeEntity {
  @PrimaryGeneratedColumn()
  landmarkTypeId: number;

  @Column()
  label: string;

  @Column()
  isEvent: number;

  @OneToMany(() => LandmarkEntity, (landmark) => landmark.landmarkType)
  landmarks: LandmarkEntity[];
}
