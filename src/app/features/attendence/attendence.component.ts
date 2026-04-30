import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ApiService } from '../../services/api.service';
import { GenericTableComponent } from '../shared/generic-table/generic-table.component';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../../header/header.component';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericTableComponent, HeaderComponent, DialogModule, DropdownModule, ButtonModule, CalendarModule],
  templateUrl: './attendence.component.html',
  styleUrl: './attendence.component.scss'
})
export class AttendenceComponent implements OnInit {

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  data: any[] = [];
  loading = false;

  selectedUser: any;

  // table columns
  columns = [
    { field: 'date', header: 'Date' },
    { field: 'check_in', header: 'Check In' },
    { field: 'check_out', header: 'Check Out' },
    { field: 'total_hours', header: 'Total Hours' },
    { field: 'overtime_hours', header: 'Overtime' },
    { field: 'status', header: 'Status' }
  ];

  // dialog
  showDialog = false;
  mode: 'create' | 'edit' = 'create';
  saving = false;
  selectedRow: any = null;

  // form
  attendanceForm!: FormGroup;

  statusOptions = [
    { label: 'Present', value: 'present' },
    { label: 'Absent', value: 'absent' }
  ];

  ngOnInit() {
    this.initForm();

    this.selectedUser = history.state.user;

    if (!this.selectedUser) {
      console.error('No user passed');
      return;
    }

    this.getAttendance();
  }

  initForm() {
    this.attendanceForm = this.fb.group({
      date: ['', Validators.required],
      check_in: ['', Validators.required],
      check_out: ['', Validators.required],
      status: ['present', Validators.required]
    });
  }

  // ================= API =================

  getAttendance() {
    this.loading = true;

    // this.api.get(`api/attendances/${this.selectedUser.id}`).subscribe({
    this.authService.getAttendance(this.selectedUser.id).subscribe({
      next: (res: any[]) => {
        this.data = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  // ================= CREATE =================

  onCreate() {
    this.mode = 'create';

    this.attendanceForm.reset({
      status: 'present',
      date: new Date()
    });

    this.showDialog = true;
  }

  // ================= EDIT =================

  onEdit(row: any) {
    this.mode = 'edit';
    this.selectedRow = row;

    this.attendanceForm.patchValue({
      date: this.parseDate(row.date),
      check_in: this.parseTime(row.check_in),
      check_out: this.parseTime(row.check_out),
      status: row.status
    });

    this.showDialog = true;
  }

  // ================= DELETE =================

  onDelete(row: any) {
    this.authService.deleteAttendace(row.id).subscribe({
      next: () => this.getAttendance()
    });
  }

  // ================= SAVE =================

  saveAttendance() {
    if (this.attendanceForm.invalid) return;

    this.saving = true;

    const formValue = this.attendanceForm.value;

    const payload = {
      date: this.formatDate(formValue.date),
      check_in: this.formatTime(formValue.check_in),
      check_out: this.formatTime(formValue.check_out),
      status: formValue.status
    };

    if (this.mode === 'create') {
      this.authService.createAttendance({
        ...payload,
        user_id: this.selectedUser.id
      }).subscribe({
        next: () => this.afterSave(),
        error: () => this.saving = false
      });

    } else {
      this.authService.updateAttendance(this.selectedRow.id, payload).subscribe({
        next: () => this.afterSave(),
        error: () => this.saving = false
      });
    }
  }

  afterSave() {
    this.saving = false;
    this.showDialog = false;
    this.getAttendance();
  }

  closeDialog() {
    this.showDialog = false;
  }

  // ================= HELPERS =================
  formatTime(date: Date) {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  formatDate(date: Date) {
    return date.toISOString().split('T')[0];
  }

  parseDate(dateStr: string): Date {
    return new Date(dateStr);
  }

  parseTime(timeStr: string): Date {
    const [h, m, s] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, s || 0);
    return date;
  }
}