import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordEntity } from './password.entity';
import { PasswordController } from './password.controller';
import { PasswordService } from './password.service';
import { LoginEntity } from 'src/login/login.entity';
import { LoginService } from 'src/login/login.service';

@Module({
  imports: [TypeOrmModule.forFeature([LoginEntity, PasswordEntity])],
  controllers: [PasswordController],
  providers: [PasswordService, LoginService],
})
export class PasswordModule {}
