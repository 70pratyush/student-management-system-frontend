import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ CommonModule, MenubarModule, InputTextModule, ButtonModule, RouterModule, RippleModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  private authService = inject(AuthService);
   
  isEmployee: boolean = false;

  items: MenuItem[] = [];

  ngOnInit() {
    const role = localStorage.getItem('ROLE');
    if (role === 'employee') {
      this.isEmployee = true;
    }
    this.items = [
      {
        label: 'Users',
        icon: 'pi pi-users',
        routerLink: '/users'
      },
      {
        label: 'Attendance',
        icon: 'pi pi-calendar',
        routerLink: '/attendance'
      }
    ];
  }

  logout() {
    this.authService.logout();
  }
}