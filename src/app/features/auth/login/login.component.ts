import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule, CardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username = '';
  password = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  login() {
    console.log(this.username, this.password);
    
    const payload = {
      username: this.username,
      password: this.password,
    };

    this.authService.login(payload).subscribe({
      next: (res: any) => {
        const userInfo = this.authService.decodeJwt(res.access_token);
        localStorage.setItem('TOKEN', res.access_token);
        this.authService.startAutoLogoutTimer(userInfo.exp);
        this.router.navigate(['/features/users']); 
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
