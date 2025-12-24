import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private secretKey = 'searchtechnology@1234';

  constructor() {}

  // 🔐 Basic AES Encryption
  encryptionAES(msg: any): string {
    const ciphertext = CryptoJS.AES.encrypt(msg, this.secretKey);
    return ciphertext.toString();
  }

  // 🔓 Basic AES Decryption
  decryptionAES(msg: any): string {
    const bytes = CryptoJS.AES.decrypt(msg, this.secretKey);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  }


}
