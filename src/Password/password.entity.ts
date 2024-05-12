import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Password')
export class PasswordEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ nullable: true })
  Login_Id: number;

  @Column({ nullable: true, name: 'old_password' })
  old_password: string;

  @Column()
  new_password: string;

  @Column({ type: 'date' })
  changed_on: Date;

  @BeforeInsert()
  setChangedOn() {
    this.changed_on = new Date();
  }
}
