import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UserCredentialDto } from './dto/user.credential.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async register() {
    return this.appService.callForRegister();
  }

  @Post()
  async authenticate(@Body() userCredentialDto: UserCredentialDto) {
    return await this.appService.callForAuth(userCredentialDto);
  }
}
