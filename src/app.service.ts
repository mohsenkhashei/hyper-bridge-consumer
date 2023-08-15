import { Injectable } from '@nestjs/common';
import { EncryptionHelper } from './helper/encryption.helper';
import { FileManager } from './helper/fileManager';
import { UserCredentialDto } from './dto/user.credential.dto';
import axios from 'axios';

@Injectable()
export class AppService {
  constructor(
    private readonly encryptionHelper: EncryptionHelper,
    private readonly fileManager: FileManager,
  ) {}

  async callForRegister() {
    try {
      const resultFile = 'RegisterResult.json';
      const result = await this.encryptionHelper.createAllKeys();
      await this.fileManager.writeFile(resultFile, JSON.stringify(result));
      return result;
    } catch (error) {
      throw error;
    }
  }

  async callForAuth(userCredentialDto: UserCredentialDto) {
    //##################################################################
    //reading data from file
    const fileData = await this.fileManager.readFile('RegisterResult.json');
    const parsedData = JSON.parse(fileData);
    //##################################################################
    const key = parsedData.key;
    //##################################################################
    // encrypting data
    const encryptedData = await this.encryptionHelper.encryptingData(
      JSON.stringify(userCredentialDto),
      key,
    );
    console.log(encryptedData);
    //##################################################################
    // calling hyper bridge
    const url = 'http://localhost:3000/api/auth';
    const header = { key: parsedData.data.data.publicKey };
    const dataToSend = { requestType: 'HASH', data: encryptedData };
    const { data } = await axios.post(url, dataToSend, {
      headers: header,
    });
    //##################################################################
    // decrypting data
    const decryptData = await this.encryptionHelper.decryptingData(
      data.data,
      key,
    );
    //##################################################################
    //writing data from file
    await this.fileManager.writeFile('AuthResult.json', decryptData);

    //##################################################################
    const decryptedDataParse = JSON.parse(decryptData);
    return decryptedDataParse;
  }
}
