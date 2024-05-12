import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { OtpEntity } from './otp.entity';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
// import { ConfigModule } from '@nestjs/config';

@Module({
  //   imports: [TypeOrmModule.forFeature([OtpEntity]), ConfigModule],
  controllers: [OtpController],
  providers: [OtpService],
})
export class OtpModule {}
