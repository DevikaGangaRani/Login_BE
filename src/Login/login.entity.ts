import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Login' })
export class LoginEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'Login_Id',
  })
  Login_Id: number;

  @Column('varchar', {
    name: 'UserName', // raw queries
    unique: true,
  })
  UserName: string; // typeorm queries

  @Column('varchar', {
    nullable: false,
    name: 'Email',
    unique: true,
  })
  Email: string;

  @Column('varchar', {
    name: 'Password',
  })
  Password: string;

  @Column('bigint', {
    name: 'Contact',
  })
  Contact: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isBlocked: boolean;

  @Column({ default: 0 })
  failedLoginAttempts: number;
  decrptpassword: string;
}
