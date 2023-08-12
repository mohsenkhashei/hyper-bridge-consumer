import { Injectable } from '@nestjs/common';
import { EncryptionHelper } from './helper/encryption.helper';
import { ResponseInitiateKey } from './ResponseInitiateKey';
import { RequestPublicKeyDto } from './RequestPublicKeyDto';
import { FileManager } from './helper/fileManager';
import { UserCredentialDto } from './dto/user.credential.dto';
import axios from 'axios';

@Injectable()
export class AppService {
  constructor(
    private readonly encryptionHelper: EncryptionHelper,
    private readonly fileManager: FileManager,
  ) {}

  callForHandshake(): ResponseInitiateKey {
    return this.encryptionHelper.initiatorKey();
  }

  async generateSecretKeyFromPublicKey(requestPublicKey: RequestPublicKeyDto) {
    const secretKey = this.encryptionHelper.initiatorSecret(
      requestPublicKey.public_key,
    );
    const data = {
      public_key: requestPublicKey.public_key,
      secret_key: secretKey,
    };
    await this.fileManager.writeFile(JSON.stringify(data));
    return data;
  }

  async sendingEncryptedData(userCredentialDto: UserCredentialDto) {
    const fileData = await this.fileManager.readFile();
    const { public_key, secret_key } = JSON.parse(fileData);
    console.log(public_key);
    const encryptedPayload = await this.encryptionHelper.encryptPayload(
      userCredentialDto,
      secret_key,
    );
    // const { data } = await axios.post(
    //   'http://localhost:3000/api/users',
    //   encryptedPayload,
    //   {
    //     headers: {
    //       testKey: public_key,
    //     },
    //   },
    // );
    console.log(encryptedPayload);
  }
}
