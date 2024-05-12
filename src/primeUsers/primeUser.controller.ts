// primeUser.controller.ts
import { Controller, Body, Post, Param } from '@nestjs/common';
import { PrimeuserService } from './primeUser.service';

@Controller('primeuser')
export class PrimeuserController {
  constructor(private readonly primeuserService: PrimeuserService) {}

  @Post('create')
  async create(@Body('UserName') UserName: string) {
    return await this.primeuserService.create(UserName);
  }

  @Post('showPrimeUsers')
  async showPrimeUsers() {
    return await this.primeuserService.findAll();
  }

  @Post('deleteUser/:Id')
  async deletePrimeUser(@Param('Id') Id: number) {
    return await this.primeuserService.deletePrimeUser(Id);
  }

  @Post('getData')
  async getData() {
    return await this.primeuserService.showData();
  }
}
