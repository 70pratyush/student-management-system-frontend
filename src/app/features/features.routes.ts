// features/feature.routes.ts
import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { AttendenceComponent } from './attendence/attendence.component';
import { LeaveComponent } from './leave/leave.component';

export const featureRoutes: Routes = [
  {
    path: 'users',
    component: UserComponent
  },
  {
    path: 'attendance',
    component: AttendenceComponent
  },
  {
    path: 'apply-leave',
    component: LeaveComponent
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  }
];