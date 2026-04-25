import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { GenericTableComponent } from '../shared/generic-table/generic-table.component';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {

  users: any[] = [];
  loading = false;

  // RBAC placeholder (not implemented yet)
  permissions: string[] = [];

  columns: any[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'name', header: 'Name', sortable: true },
    { field: 'username', header: 'Username' },
    { field: 'email', header: 'Email' },
    { field: 'phone_no', header: 'Phone' },
    { field: 'age', header: 'Age' },
    { field: 'roleName', header: 'Role' } // only role name
  ];

  private authService = inject(AuthService)

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.loading = true;

    this.authService.getUsers().subscribe({
      next: (res: User[]) => {
        // Normalize API response
        this.users = res.map(user => ({
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          phone_no: user.phone_no,
          age: user.age,

          // only role name (first role or join if multiple)
          roleName: user.roles?.map(r => r.name).join(', ') || '-',

          // keeping raw if needed later
          roles: user.roles
        }));

        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.loading = false;
      }
    });
  }
}