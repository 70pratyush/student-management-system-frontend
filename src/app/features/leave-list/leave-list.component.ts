import { Component, inject } from '@angular/core';
import { GenericTableComponent } from '../shared/generic-table/generic-table.component';
import { HeaderComponent } from '../../header/header.component';
import { AuthService } from '../../services/auth.service';
import { Leave } from '../../models/leave.model';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [GenericTableComponent, HeaderComponent, DialogModule, ButtonModule],
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

columns = [
  { field: 'id', header: 'ID' },
  { field: 'leaveType', header: 'Leave Type' },
  { field: 'startDate', header: 'Start Date' },
  { field: 'endDate', header: 'End Date' },
  { field: 'duration', header: 'Days' },
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
        leaveType: leave.leave_type,
        startDate: leave.start_date,
        endDate: leave.end_date,
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

formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-IN');
}

formatLeaveType(type: string): string {
  return type
    .replace('_', ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

onDelete(row: any) {

}

onEdit(row: any) {

}
}
