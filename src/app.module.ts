import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EncryptionHelper } from './helper/encryption.helper';
import { FileManager } from './helper/fileManager';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EncryptionHelper, FileManager],
})
export class AppModule {}
