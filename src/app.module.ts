import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoginModule } from './login/login.module';
import { LoginEntity } from './login/login.entity';
import { PasswordModule } from './Password/password.module';
import { PasswordEntity } from './Password/password.entity';
// import { OtpEntity } from './Otp/otp.entity';
import { OtpModule } from './Otp/otp.module';
import { PrimeuserModule } from './primeUsers/primeUser.module';
import { PrimeuserEntity } from './primeUsers/primeUser.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('HOST'),
        username: configService.get('USERNAME'),
        password: configService.get('PASSWORD'),
        database: configService.get('DATABASE'),
        entities: [LoginEntity, PasswordEntity, PrimeuserEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    LoginModule,
    PasswordModule,
    OtpModule,
    PrimeuserModule,
  ],
})
export class AppModule {}
