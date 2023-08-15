import { Injectable } from '@nestjs/common';
import { EncryptionHelper } from './helper/encryption.helper';
import { FileManager } from './helper/fileManager';
import { UserCredentialDto } from './dto/user.credential.dto';
import { parse } from 'path';
import axios from 'axios';

@Injectable()
export class AppService {
  constructor(
    private readonly encryptionHelper: EncryptionHelper,
    private readonly fileManager: FileManager,
  ) {}

  async callForRegister() {
    try {
      const result = await this.encryptionHelper.createAllKeys();
      await this.fileManager.writeFile(JSON.stringify(result));
      return result;
    } catch (error) {
      throw error;
    }
  }

  async callForAuth(userCredentialDto: UserCredentialDto) {
    //##################################################################
    //reading data from file
    const fileData = await this.fileManager.readFile();
    const parsedData = JSON.parse(fileData);
    //##################################################################
    const key = parsedData.key;
    //##################################################################

    const encryptedData = await this.encryptionHelper.encryptingData(
      JSON.stringify(userCredentialDto),
      key,
    );
    console.log(encryptedData);
    //##################################################################
    const url = 'http://localhost:3000/api/auth';
    const header = { key: parsedData.data.data.publicKey };
    const dataToSend = { requestType: 'HASH', data: encryptedData };
    const { data } = await axios.post(url, dataToSend, {
      headers: header,
    });

    return data;
  }

  async sendingEncryptedData(userCredentialDto: UserCredentialDto) {
    // const fileData = await this.fileManager.readFile();
    // const { public_key, secret_key } = JSON.parse(fileData);
    // const encryptedPayload = await this.encryptionHelper.encryptPayload(
    //   JSON.stringify(userCredentialDto),
    //   secret_key,
    // );
    // console.log('encrypted');
    // console.log(encryptedPayload);
    // const { data } = await axios.post(
    //   'http://localhost:3000/api/auth',
    //   { data: encryptedPayload },
    //   {
    //     headers: {
    //       key: public_key,
    //     },
    //   },
    // );
    // if (data.responseType == 'HASH') {
    //   const decryptPayload = await this.encryptionHelper.decryptPayload(
    //     secret_key,
    //     data.data,
    //   );
    //   return decryptPayload;
    // }
    // if (data.responseType == 'JSON') {
    //   return data.data;
    // }
  }
}
