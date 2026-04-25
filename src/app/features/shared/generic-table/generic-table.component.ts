import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss'
})
export class GenericTableComponent {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() loading = false;

  // optional features
  @Input() paginator = true;
  @Input() rows = 10;

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
}