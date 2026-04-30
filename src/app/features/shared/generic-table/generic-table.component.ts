import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [TableModule, CommonModule, CardModule, ButtonModule, ToastModule, RadioButtonModule, FormsModule],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss',
})
export class GenericTableComponent {
  @Input() title: string = '';
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() loading: boolean = false;
  @Input() showAttendance!: boolean;
  
  @Input() crudConfig?: {
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
  };
  // optional features
  @Input() paginator = true;
  @Input() rows = 10;

  @Output() create = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() action = new EventEmitter<any>();

  selectedRow: any = null;

  // RBAC hook (plug for permission service)
  hasPermission(permission?: string): boolean {
    if (!permission) return true;

    // replace with actual permission service
    return true;
  }

  resolveField(row: any, col: any) {
    if (col.renderer) {
      return col.renderer(row);
    }

    return this.getNestedValue(row, col.field);
  }

  private getNestedValue(obj: any, path: string) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

  get showActions(): boolean {
    return !!(this.crudConfig?.edit || this.crudConfig?.delete);
  }

  onActionClick() {
    if (this.selectedRow) {
      this.action.emit(this.selectedRow);
    }
  }

  onCreate() {
    this.create.emit();
  }

  onEdit(row: any) {
    this.edit.emit(row);
  }

  onDelete(row: any, event: Event) {    
    this.delete.emit(row);
  }
}
