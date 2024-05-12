// import {
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { LoginEntity } from '../Login/login.entity';

// @Entity({ name: 'OTP' })
// export class OtpEntity {
//   @PrimaryGeneratedColumn({
//     name: 'Id',
//   })
//   id: number;

//   @Column('int', {
//     name: 'OTP',
//   })
//   otp: number;

//   @ManyToOne(() => LoginEntity)
//   @JoinColumn({ name: 'Login_Id' })
//   login: LoginEntity;

//   @Column('datetime', {
//     name: 'created_date',
//     default: () => 'CURRENT_TIMESTAMP',
//   })
//   createdAt: Date;

//   @Column('datetime', {
//     name: 'expiry_time',
//   })
//   expiryTime: Date;
// }
