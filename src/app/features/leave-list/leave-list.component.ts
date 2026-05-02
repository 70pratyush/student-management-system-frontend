import { Component, inject } from '@angular/core';
import { GenericTableComponent } from '../shared/generic-table/generic-table.component';
import { HeaderComponent } from '../../header/header.component';
import { AuthService } from '../../services/auth.service';
import { Leave } from '../../models/leave.model';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [GenericTableComponent, HeaderComponent, DialogModule, ButtonModule, FormsModule, CommonModule, DropdownModule, CalendarModule],
  templateUrl: './leave-list.component.html',
  styleUrl: './leave-list.component.scss'
})
export class LeaveListComponent {

  userLeave: any[] = [];
  loading = false;
  displayEditDialog = false;

  selectedLeave: any = null;
  actionLoading = false;

  private router = inject(Router);
  private authService = inject(AuthService);
  userId: number | null = null;

  leaveTypes = [
  { label: 'Sick Leave', value: 'sick_leave' },
  { label: 'Vacation', value: 'vacation' },
  { label: 'Unpaid Leave', value: 'unpaid_leave' }
];

columns = [
  { field: 'id', header: 'ID' },
  { field: 'leaveTypeLabel', header: 'Leave Type' }, 
  { field: 'startDateLabel', header: 'Start Date' }, 
  { field: 'endDateLabel', header: 'End Date' },    
  { field: 'status', header: 'Status' }
];

  ngOnInit() {
    const user = history.state.user;
    this.userId = user.id;

    this.getLeaves();
  }

  getLeaves() {
    this.loading = true;

    this.authService.getUserLeave(this.userId).subscribe({
      next: (res) => {
this.userLeave = res.map((leave: any) => ({
  id: leave.id,
  leaveType: leave.leave_type, // keep raw for edit
  leaveTypeLabel: this.getLeaveLabel(leave.leave_type), 
  startDate: new Date(leave.start_date),
  endDate: new Date(leave.end_date),
  startDateLabel: this.formatDate(leave.start_date), 
  endDateLabel: this.formatDate(leave.end_date),     
  status: leave.status
}));

        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching leaves:', err);
        this.loading = false;
      }
    });
  }

  getLeaveLabel(value: string): string {
  return this.leaveTypes.find(l => l.value === value)?.label || value;
}

  formatDateForApi(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-IN');
  }

  formatLeaveType(type: string): string {
    return type
      .replace('_', ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  onDelete(row: any) {
    this.selectedLeave = row;

    if (!this.selectedLeave) return;

    this.actionLoading = true;

    this.authService.deleteLeave(this.selectedLeave.id).subscribe({
      next: (res) => {
        this.actionLoading = false;
        this.authService.show('success', 'Action Completed', 'Leave Record has been successfully deleted')
        this.getLeaves(); // refresh list
      },
      error: (err) => {
        console.error('Delete failed', err);
        this.actionLoading = false;
      }
    });
  }

  onEdit(row: any) {
    this.selectedLeave = { ...row }; // clone to avoid direct mutation
    this.displayEditDialog = true;
  }

  confirmEdit() {
    if (!this.selectedLeave) return;

    this.actionLoading = true;

    const payload = {
      leave_type: this.selectedLeave.leaveType,
      start_date: this.selectedLeave.startDate,
      end_date: this.selectedLeave.endDate
    };

    this.authService.updateLeave(this.selectedLeave.id, payload).subscribe({
      next: () => {
        this.displayEditDialog = false;
        this.actionLoading = false;
        this.getLeaves(); // refresh
      },
      error: (err) => {
        console.error('Update failed', err);
        this.actionLoading = false;
      }
    });
  }
}
