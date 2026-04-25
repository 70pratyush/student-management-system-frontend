// features/feature.routes.ts
import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';

export const featureRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'users',
        component: UserComponent
      },
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      }
    ]
  }
];