import {Injectable} from '@angular/core';
import {from, map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BiometricAuthService {
  private storedCredentials: { username: string, credential: PublicKeyCredential | any }[] = [];

  async register(username: string): Promise<void> {
    try {
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge: new Uint8Array([
          // must be a cryptographically random number sent from a server
          0x8c, 0x0a, 0x26, 0xff, 0x22, 0x91, 0xc1, 0xe9, 0xb9, 0x4e, 0x2e, 0x17, 0x1a,
          0x98, 0x6a, 0x73, 0x71, 0x9d, 0x43, 0x48, 0xd5, 0xa7, 0x6a, 0x15, 0x7e, 0x38,
          0x94, 0x52, 0x77, 0x97, 0x0f, 0xef,
        ]).buffer,
        rp: {
          name: 'localhost'
        },
        user: {
          id: new Uint8Array([9, 10, 11, 12]),
          name: username,
          displayName: username
        },
        pubKeyCredParams: [
          {alg: -7, type: 'public-key'},
          {alg: -257, type: 'public-key'},
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          requireResidentKey: false,
          userVerification: 'preferred'
        },
        timeout: 60000,
        attestation: 'direct'
      };

      const credentials = await navigator.credentials.create({publicKey: publicKeyCredentialCreationOptions});
      if (credentials && credentials.type === 'public-key') {
        const credential = credentials as PublicKeyCredential;
        this.storedCredentials.push({username, credential});
        console.log(`Registered user '${username}'`);
        console.log(this.storedCredentials);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }

  login(username: string): Observable<string | null> {
    const storeCredential = this.storedCredentials.find(c => c.username === username);
    if (!storeCredential) {
      console.error(`No credentials found for user '${username}'`);
      return of(null);
    }

    const requestOptions: PublicKeyCredentialRequestOptions = {
      challenge: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
      allowCredentials: [
        {
          id: storeCredential.credential.rawId,
          type: storeCredential.credential.type,
          transports: storeCredential.credential?.transports
        }
      ],
      userVerification: 'preferred',
      timeout: 60000
    };

    return from(navigator.credentials.get({publicKey: requestOptions}))
      .pipe(
        map((credential: any) => {
          if (credential instanceof PublicKeyCredential) {
            if (storeCredential.credential.id === credential.id) {
              return username;
            }
          }
          return null;
        })
      );
  }

  logout(username: string) {
    const index = this.storedCredentials.findIndex(c => c.username === username);
    if (index) {
      this.storedCredentials.slice(index, 1)
    }
  }
}
