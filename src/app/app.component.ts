import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';
import { HeaderComponent } from './layout/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'SMS-frontend';

  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.initAuth();
  }
}
