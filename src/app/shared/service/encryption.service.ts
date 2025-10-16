import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  public static readonly base64Key = 'Z7RrRG/bODKvYRtLDZZnmqlWhTuFwXp0NCDzZ7jodUo=';
  private static readonly ivLength = 12;

  private static async getKey(): Promise<CryptoKey> {
    const rawKey = Uint8Array.from(atob(this.base64Key), c => c.charCodeAt(0));
    return crypto.subtle.importKey(
      'raw',
      rawKey,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(plainText: string): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(this.ivLength));
    const key = await this.getKey();
    const encoder = new TextEncoder();
    const encodedText = encoder.encode(plainText);

    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encodedText
    );

    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  static async decrypt(encryptedBase64: string): Promise<string> {
    const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
    const iv = combined.slice(0, this.ivLength);
    const encryptedData = combined.slice(this.ivLength);

    const key = await this.getKey();
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedData
    );

    return new TextDecoder().decode(decryptedBuffer);
  }
}
