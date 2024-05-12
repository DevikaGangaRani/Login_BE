import { Body, Controller, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('create')
  async create(@Body() loginDto: LoginDto) {
    return await this.loginService.create(loginDto);
  }

  @Post('showall')
  async showall(@Body('page') page: number, @Body('limit') limit: number = 10) {
    return await this.loginService.pagination(page, limit);
  }

  @Post('showBockedUsers')
  async getBlockedUsers() {
    return await this.loginService.findBlockedUsers();
  }

  @Post('deactivate/:Login_Id')
  async deactivateUser(@Param('Login_Id') Login_Id: number): Promise<void> {
    await this.loginService.deactivateUser(Login_Id);
  }

  @Post('activate/:Login_Id')
  async activateUser(@Param('Login_Id') Login_Id: number): Promise<void> {
    await this.loginService.activateUser(Login_Id);
  }

  @Post('setUserUnblock/:Login_Id')
  async setUserUnblock(@Param('Login_Id') Login_Id: number): Promise<void> {
    await this.loginService.unBlockUser(Login_Id);
  }

  @Post('block/:Login_Id')
  async blockUser(@Param('Login_Id') Login_Id: number): Promise<void> {
    await this.loginService.blockUser(Login_Id);
  }

  @Post('authenticate')
  async authenticate(
    @Body() credentials: { username: string; password: string },
    @Res() res,
  ) {
    try {
      const user = await this.loginService.validateCredentials(
        credentials.username,
        credentials.password,
      );

      if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'Incorrect username or password. Please try again.',
        });
      }

      if (!user.isActive) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'User credentials are deactivated',
        });
      }

      if (user.isBlocked) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message:
            'Your account has been blocked due to multiple failed login attempts. Please contact support to unblock your account.',
        });
      }

      if (user.failedLoginAttempts > 3) {
        await this.loginService.blockUser(user.Login_Id);
        return res;
        // .status(HttpStatus.UNAUTHORIZED && HttpStatus.INTERNAL_SERVER_ERROR)
        // .json({
        //   success: true,
        // });
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Login successful!',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          'Your account has been blocked due to multiple failed login attempts.',
      });
    }
  }

  @Post(':email')
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.loginService.getUserByEmail(email);
    return user;
  }
}
