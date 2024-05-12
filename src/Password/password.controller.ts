// password.controller.ts

import { Controller, Post, Body, Param } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordDto } from './dto/password.dto';

@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post('create')
  async create(@Body() passwordDto: PasswordDto) {
    try {
      const { Email, new_password } = passwordDto;
      return await this.passwordService.create(Email, new_password);
    } catch (error) {
      throw error;
    }
  }

  @Post('getData/:UserName')
  async getPasswordData(@Param('UserName') UserName: string) {
    try {
      const passwordData = await this.passwordService.showData(UserName);
      return { success: true, data: passwordData };
    } catch (error) {
      return error;
    }
  }
}
