// features/feature.routes.ts
import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { AttendenceComponent } from './attendence/attendence.component';

export const featureRoutes: Routes = [
  {
    path: 'users',
    component: UserComponent
  },
  {
    path: 'attendence',
    component: AttendenceComponent
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  }
];