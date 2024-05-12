import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordEntity } from './password.entity';
import { LoginEntity } from 'src/login/login.entity';
import { LoginService } from 'src/login/login.service';
import moment from 'moment';
import Cryptr from 'cryptr';

@Injectable()
export class PasswordService {
  private readonly cryptr: any;

  constructor(
    @InjectRepository(PasswordEntity)
    private readonly passwordRepository: Repository<PasswordEntity>,
    @InjectRepository(LoginEntity)
    private readonly loginRepository: Repository<LoginEntity>,
    private readonly loginService: LoginService,
  ) {
    this.cryptr = new Cryptr('myTotallySecretKey', {
      encoding: 'base64',
      pbkdf2Iterations: 10000,
      saltLength: 10,
    });
  }

  private encryptPassword(password: string): string {
    return this.cryptr.encrypt(password);
  }

  async create(email: string, password: string): Promise<PasswordEntity> {
    try {
      const user = await this.loginService.getUserByEmail(email);

      console.log('data:', user);
      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }
      const encryptedPassword = this.encryptPassword(password);
      const newPasswordEntity = new PasswordEntity();
      newPasswordEntity.Login_Id = user.Login_Id;
      newPasswordEntity.old_password = user.Password;
      newPasswordEntity.new_password = encryptedPassword;

      const savedPasswordEntity =
        await this.passwordRepository.save(newPasswordEntity);
      user.Password = encryptedPassword;
      await this.loginRepository.save(user);

      return savedPasswordEntity;
    } catch (error) {
      throw error;
    }
  }

  async showData(UserName) {
    try {
      const result = await this.passwordRepository
        .createQueryBuilder('Password')
        .select('Password.old_password', 'old_password')
        .addSelect('Password.new_password', 'new_password')
        .addSelect('Password.changed_on', 'changed_on')
        .addSelect('Login.UserName', 'UserName')
        .leftJoin('LoginEntity', 'Login', 'Login.Login_Id = Password.Login_Id') // Assuming 'id' is the correct property for Login_Id
        .where('Login.UserName = :UserName', { UserName })
        .getRawMany();

      const formattedResults = result.map((row) => ({
        ...row,
        changed_on: moment(row.changed_on).format('YYYY-MM-DD'),
      }));

      return formattedResults;
    } catch (err) {
      throw err;
    }
  }
}
