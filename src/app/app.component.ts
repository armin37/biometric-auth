import {Component} from '@angular/core';
import {BiometricAuthService} from "./services/biometric-auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'biometric-authentication';
  username: string | null = '';
  authenticated = false;

  constructor(private biometricAuthService: BiometricAuthService) {
  }

  register(): void {
    if (this.username) {
      this.biometricAuthService.register(this.username);
    }
  }

  login(): void {
    if (this.username) {
      this.biometricAuthService.login(this.username).subscribe(user => {
        this.username = user;
        this.authenticated = true;
      });
    }
  }

  logout() {
    if (this.username) {
      this.username = null;
      this.authenticated = false;
    }
  }
}
