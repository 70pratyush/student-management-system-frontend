import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { GenericTableComponent } from '../shared/generic-table/generic-table.component';
import { TableModule } from 'primeng/table';
import { HeaderComponent } from '../../header/header.component';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [GenericTableComponent, HeaderComponent, ButtonModule, DialogModule, ReactiveFormsModule, InputTextModule, DropdownModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  showCreateDialog = false;
  saving = false;

  roles = [
    { label: 'Employee', value: 'employee' },
    { label: 'Admin', value: 'admin' },
    { label: 'Manager', value: 'manager' }
  ];

  mode: 'create' | 'edit' = 'create';
  selectedUser: any = null;

  userForm!: FormGroup;

  private fb = inject(FormBuilder);

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
  private router = inject(Router)

  ngOnInit(): void {
    this.initForm();
    this.getUsers();
  }

  initForm() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_no: [''],
      age: [null],
      password: ['', Validators.required],
      role: [null, Validators.required]
    });
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

  onCreate() {
    this.mode = 'create';
    this.selectedUser = null;

    this.showCreateDialog = true;
    this.userForm.reset();
  }

  saveUser() {
    if (this.userForm.invalid) return;

    this.saving = true;

    const formValue = this.userForm.value;

    const payload = {
      name: formValue.name,
      age: formValue.age,
      email: formValue.email,
      phone_no: formValue.phone_no,
      username: formValue.username,
      password: formValue.password,
      role: [formValue.role]
    };

    if (this.mode === 'create') {
      this.createUser(payload);
    } else {
      this.updateUser(payload);
    }
  }
  closeDialog() {
    this.showCreateDialog = false;
  }

  createUser(payload: any) {
    this.authService.createUser(payload).subscribe({
      next: () => {
        this.afterSuccess();
      },
      error: (err) => {
        console.error('Create failed:', err);
        this.saving = false;
      }
    });
  }

  updateUser(payload: any) {
    const oldUsername = this.selectedUser.username;

    this.authService.updateUser(oldUsername, payload).subscribe({
      next: () => {
        this.afterSuccess();
      },
      error: (err) => {
        console.error('Update failed:', err);
        this.saving = false;
      }
    });
  }

  afterSuccess() {
    this.saving = false;
    this.showCreateDialog = false;
    this.getUsers();
  }

  onEdit(user: any) {
    this.mode = 'edit';
    this.selectedUser = user;

    this.showCreateDialog = true;

    this.userForm.patchValue({
      name: user.name,
      username: user.username,
      email: user.email,
      phone_no: user.phone_no,
      age: user.age,
      password: '', // don’t prefill password
      role: user.roles?.[0]?.name || null
    });
  }

  onDelete(user: any) {
    const confirmDelete = confirm(`Delete user ${user.name}?`);
    if (!confirmDelete) return;

    this.loading = true;

    this.authService.deleteUser(user.username).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.username !== user.username);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Delete failed:', err);
        this.loading = false;
      }
    });
  }
}