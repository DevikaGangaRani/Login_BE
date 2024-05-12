import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Primeuser')
export class PrimeuserEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ unique: true })
  UserName: string;
}
