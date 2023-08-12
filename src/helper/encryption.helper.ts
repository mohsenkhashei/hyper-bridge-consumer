import { Injectable } from '@nestjs/common';
import {
  BinaryLike,
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
  createDiffieHellman,
  DiffieHellman,
} from 'crypto';

@Injectable()
export class EncryptionHelper {
  private initiator: DiffieHellman;
  private algorithm: string;
  private key: string;
  // constructor(){}

  initiatorKey(): {
    key: string;
    prime: string;
    generator: string;
  } {
    const first = createDiffieHellman(512);
    this.initiator = first;
    console.log(this.initiator);
    const key = first.generateKeys('base64');
    const prime = first.getPrime('base64');
    const generator = first.getGenerator('base64');
    return {
      key,
      prime,
      generator,
    };
  }

  initiatorSecret(recipientKey: string): string {
    console.log(this.initiator);
    const secret = this.initiator.computeSecret(
      recipientKey,
      'base64',
      'base64',
    );
    return secret;
  }

  // async decryptPayload(
  //   headerValue: string,
  //   data: { payload: string; salt: string },
  // ) {
  //   const secretKey = this.dataCollector[headerValue];
  //   if (!secretKey) {
  //     throw new Error('Invalid header value');
  //   }
  //   const encryption = new Encrypter(secretKey, data.salt);
  //   return JSON.parse(encryption.decrypt(data.payload));
  // }

  async encryptPayload(payload: object, secretKey: string) {
    const salt = randomBytes(32).toString('base64');

    if (!secretKey) {
      throw new Error('Invalid public key value');
    }

    this.algorithm = 'aes-256-cbc';

    const key = scryptSync(secretKey, salt, 32);
    const iv = randomBytes(16);

    const cipher = createCipheriv(this.algorithm, key, iv);
    const encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
    return [
      encrypted + cipher.final('hex'),
      Buffer.from(iv).toString('hex'),
    ].join('|');
  }
}
