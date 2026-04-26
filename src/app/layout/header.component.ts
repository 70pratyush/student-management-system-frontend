import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <header class="app-header">
      <div class="title">Staff Management System</div>

        <p-button icon="pi pi-sign-out" severity="danger" [rounded]="true" (click)="logout()"/>
    </header>
  `,
  styles: [`
    .app-header {

      top: 0;
      left: 0;
      width: 100%;
      height: 4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      background: #000;
      color: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .title {
      font-size: 1.2rem;
      font-weight: 600;
    }
  `]
})
export class HeaderComponent {
    private authService = inject(AuthService)
   
    logout() {
        this.authService.logout()
    }
}