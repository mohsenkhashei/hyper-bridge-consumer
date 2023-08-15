import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  createCipheriv,
  createDecipheriv,
  getDiffieHellman,
  createHash,
} from 'crypto';

@Injectable()
export class EncryptionHelper {
  private algorithm = 'aes-256-cbc';

  async createAllKeys() {
    //create public key
    const client = getDiffieHellman('modp15');
    client.generateKeys();
    const clientPublicKey = client.getPublicKey('hex');
    console.log({ clientPublicKey });
    //calling to share public key
    const request = {
      publicKey: clientPublicKey,
      deviceId: '2342342324',
      name: 'mohsenkhashei',
    };
    const { data } = await axios.post(
      'http://localhost:3000/api/register',
      request,
    );
    const serverPublicKey = data.serverPublicKey;
    console.log(data);
    // generate shared secret key and key
    client.generateKeys();
    const sharedSecret = client.computeSecret(
      data.data.serverPublicKey,
      'hex',
      'hex',
    );
    const key = this.generatingKey(sharedSecret);

    // return all
    return { clientPublicKey, serverPublicKey, sharedSecret, key, data };
  }
  async generateSharedSecretKeyFromPublicKey(publicKey) {
    const client = getDiffieHellman('modp15');

    client.generateKeys();
    const sharedSecret = client.computeSecret(publicKey, 'hex', 'hex');
    return sharedSecret;
  }

  generatingKey(secretKey) {
    // Generate secret hash with crypto to use for encryption
    const key = createHash('sha512')
      .update(secretKey)
      .digest('hex')
      .substring(0, 32);
    // const key = scryptSync(secretKey, 'salt', 32);
    return key;
  }
  // Encrypt data
  encryptingData(data, key) {
    const encryptionIV = createHash('sha512').digest('hex').substring(0, 16);
    const cipher = createCipheriv(this.algorithm, key, encryptionIV);
    return Buffer.from(
      cipher.update(data, 'utf8', 'hex') + cipher.final('hex'),
    ).toString('base64'); // Encrypts data and converts to hex and base64
  }
  // Decrypt data
  decryptingData(encryptedData, key) {
    const encryptionIV = createHash('sha512').digest('hex').substring(0, 16);
    const buff = Buffer.from(encryptedData, 'base64');
    const decipher = createDecipheriv(this.algorithm, key, encryptionIV);
    return (
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8')
    ); // Decrypts data and converts to utf8
  }
}
