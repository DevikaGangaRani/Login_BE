// primeUser.service.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { PrimeuserEntity } from './primeUser.entity';
import { LoginEntity } from 'src/login/login.entity';

@Injectable()
export class PrimeuserService {
  constructor(
    @InjectRepository(PrimeuserEntity)
    private primeuserRepository: Repository<PrimeuserEntity>,
    @InjectRepository(LoginEntity)
    private readonly loginRepository: Repository<LoginEntity>,
  ) {}

  async create(UserName: string) {
    try {
      const user = this.primeuserRepository.create({ UserName: UserName });
      await this.primeuserRepository.save(user);
      return user;
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes('ER_DUP_ENTRY')
      ) {
        throw new ConflictException('User with this name already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.primeuserRepository.find();
  }

  async showData() {
    try {
      const result = await this.primeuserRepository
        .createQueryBuilder('Primeuser')
        .select('Primeuser.UserName', 'UserName')
        .addSelect('Login.Login_Id', 'Login_Id')
        .addSelect('Primeuser.Id', 'Id')
        .leftJoin('LoginEntity', 'Login', 'Login.UserName = Primeuser.UserName')
        .getRawMany();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async deletePrimeUser(Id: number) {
    return await this.primeuserRepository.delete(Id);
  }
}
