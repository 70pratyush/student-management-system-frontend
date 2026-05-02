// features/feature.routes.ts
import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { AttendenceComponent } from './attendence/attendence.component';
import { LeaveComponent } from './leave/leave.component';
import { roleGuard } from '../guards/employee.guard';
import { LeaveListComponent } from './leave-list/leave-list.component';

export const featureRoutes: Routes = [
  {
    path: 'users',
    component: UserComponent,
    canActivate: [roleGuard],
    data: { roles: ['admin', 'hr', 'manager'] }
  },
  {
    path: 'attendance',
    component: AttendenceComponent,
    canActivate: [roleGuard],
    data: { roles: ['admin', 'hr', 'manager'] }
  },  
  {
    path: 'leave-list',
    component: LeaveListComponent,
    canActivate: [roleGuard],
    data: { roles: ['admin', 'hr', 'manager'] }
  },  
  {
    path: 'apply-leave',
    component: LeaveComponent,
    canActivate: [roleGuard],
    data: { roles: ['employee'] }
  },
];