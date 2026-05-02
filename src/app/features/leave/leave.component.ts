import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [HeaderComponent, CardModule, DialogModule, ButtonModule, DropdownModule, CalendarModule, FormsModule, CommonModule],
  templateUrl: './leave.component.html',
  styleUrl: './leave.component.scss'
})
export class LeaveComponent {
  showDialog = false;
  isSubmitting = false;

  leaveTypes = [
    { label: 'Sick Leave', value: 'sick_leave' },
    { label: 'Casual Leave', value: 'casual_leave' },
    { label: 'Paid Leave', value: 'paid_leave' }
  ];

  form: any = {
    user_id: 5, // later replace with decoded JWT user id
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

    this.http.post('http://127.0.0.1:8000/api/leave_request/', payload, { headers })
      .subscribe({
        next: (res: any) => {
          console.log('Success:', res);
          this.showDialog = false;
          this.isSubmitting = false;
        },
        error: (err) => {
          setTimeout(() => {
            this.isSubmitting = false;
          }, 2000);
          console.error('Error:', err);
        }
      });
  }
}