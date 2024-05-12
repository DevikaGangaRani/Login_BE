import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrimeuserEntity } from './primeUser.entity';
import { PrimeuserController } from './primeUser.controller';
import { PrimeuserService } from './primeUser.service';
import { LoginEntity } from 'src/login/login.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrimeuserEntity, LoginEntity])],
  controllers: [PrimeuserController],
  providers: [PrimeuserService],
})
export class PrimeuserModule {}
