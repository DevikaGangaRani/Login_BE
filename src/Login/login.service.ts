import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { LoginEntity } from './login.entity';
import { LoginDto } from './dto/login.dto';
import Cryptr from 'cryptr';

@Injectable()
export class LoginService {
  private readonly cryptr: any;

  constructor(
    @InjectRepository(LoginEntity)
    private readonly loginRepository: Repository<LoginEntity>,
  ) {
    this.cryptr = new Cryptr('myTotallySecretKey', {
      encoding: 'base64',
      pbkdf2Iterations: 10000,
      saltLength: 10,
    });
  }

  async create(dto: LoginDto) {
    const userNameExists = await this.loginRepository.findOne({
      where: { UserName: dto.UserName },
    });
    if (userNameExists) {
      throw new BadRequestException('Username already exists');
    }
    const isPasswordValid = this.validatePassword(dto.Password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password format');
    }
    const encryptedPassword = this.encryptPassword(dto.Password);
    const todo = await this.loginRepository.create({
      ...dto,
      Password: encryptedPassword,
    });
    return await this.loginRepository.save(todo);
  }

  private validatePassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return passwordRegex.test(password);
  }

  async pagination(page: number = 1, limit: number = 10) {
    const options: FindManyOptions<LoginEntity> = {
      skip: (page - 1) * limit,
      take: limit,
    };
    const [todos, totalCount] =
      await this.loginRepository.findAndCount(options);
    const totalPages = Math.ceil(totalCount / limit);

    return { todos, totalCount, totalPages, currentPage: page };
  }

  async findBlockedUsers(): Promise<LoginEntity[]> {
    return await this.loginRepository.find({ where: { isBlocked: true } });
  }

  async deactivateUser(Login_Id: number) {
    await this.loginRepository.update({ Login_Id }, { isActive: false });
  }

  async activateUser(Login_Id: number) {
    await this.loginRepository.update({ Login_Id }, { isActive: true });
  }

  async unBlockUser(Login_Id: number): Promise<void> {
    const user = await this.loginRepository.findOne({ where: { Login_Id } });
    if (!user) {
      throw new Error(`User with ID ${Login_Id} not found`);
    }
    user.isBlocked = false;
    user.failedLoginAttempts = 0;
    await this.loginRepository.save(user);
  }

  async blockUser(Login_Id: number) {
    const user = await this.loginRepository.findOne({ where: { Login_Id } });
    if (!user) {
      throw new Error(`User with ID ${Login_Id} not found`);
    }
    user.isBlocked = true;
    await this.loginRepository.save(user);
  }

  async validateCredentials(username: string, password: string) {
    const user = await this.loginRepository.findOne({
      where: { UserName: username },
    });
    if (user && this.cryptr.decrypt(user.Password) === password) {
      user.failedLoginAttempts = 0;
      await this.loginRepository.save(user);
      return user;
    } else if (user) {
      user.failedLoginAttempts++;
      if (user.failedLoginAttempts > 3) {
        user.isBlocked = true;
        await this.loginRepository.save(user);
        throw new BadRequestException(
          'Your account has been blocked due to multiple failed login attempts',
        );
      }
      await this.loginRepository.save(user);
    }
    return null;
  }

  async getUserByEmail(email: string) {
    const user = await this.loginRepository.findOne({
      where: { Email: email },
    });
    if (!user) {
      throw new BadRequestException(`User with email ${email} not found`);
    }
    const decryptedPassword = await this.decryptPassword(user.Password);
    user.Password = decryptedPassword;
    return user;
  }

  private async decryptPassword(encryptedPassword: string): Promise<string> {
    try {
      return await this.cryptr.decrypt(encryptedPassword);
    } catch (error) {
      throw new Error('Error decrypting password');
    }
  }

  private encryptPassword(password: string): string {
    return this.cryptr.encrypt(password);
  }
}
