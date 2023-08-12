import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseInitiateKey } from './ResponseInitiateKey';
import { RequestPublicKeyDto } from './RequestPublicKeyDto';
import { UserCredentialDto } from './dto/user.credential.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async callForHandshake(): Promise<ResponseInitiateKey> {
    return this.appService.callForHandshake();
  }

  @Post()
  async dealWithPublicKey(@Body() requestPublicKey: RequestPublicKeyDto) {
    return await this.appService.generateSecretKeyFromPublicKey(
      requestPublicKey,
    );
  }

  @Post('/encrypt')
  async sendigEncryptedData(@Body() userCredentialDto: UserCredentialDto) {
    return await this.appService.sendingEncryptedData(userCredentialDto);
  }
}
