import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginEntity } from './login.entity';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LoginEntity])],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
