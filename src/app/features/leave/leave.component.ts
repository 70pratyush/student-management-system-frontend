import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [HeaderComponent, CardModule, DialogModule, ButtonModule, DropdownModule, CalendarModule, ToastModule, FormsModule, CommonModule],
  templateUrl: './leave.component.html',
  styleUrl: './leave.component.scss'
})
export class LeaveComponent {
  showDialog = false;
  isSubmitting = false;

  userId = Number(localStorage.getItem("USER_ID"))
  leaveTypes = [
    { label: 'Sick Leave', value: 'sick_leave' },
    { label: 'Vacation', value: 'vacation' },
    { label: 'Unpaid Leave', value: 'unpaid_leave' }
  ];

  private authService = inject(AuthService);

  form: any = {
    user_id: this.userId,
    leave_type: '',
    start_date: '',
    end_date: '',
    status: 'pending'
  };

  constructor(private http: HttpClient) {}

  openDialog() {
    this.showDialog = true;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  applyLeave() {
    this.isSubmitting = true;

    const payload = {
      ...this.form,
      start_date: this.formatDate(this.form.start_date),
      end_date: this.formatDate(this.form.end_date)
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer YOUR_TOKEN_HERE`
    });

    this.authService.createLeave(payload)
      .subscribe({
        next: (res: any) => {
          console.log('Success:', res);
          this.showDialog = false;
          this.isSubmitting = false;
          this.authService.show('success', 'Leave Applied!!', "Your Leave has applied successfully")
        },
        error: (err) => {
          this.isSubmitting = false;4
          this.authService.show('danger', 'Error', "Your Leave has failed to applied")
          console.error('Error:', err);
        }
      });
  }
}