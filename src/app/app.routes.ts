import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
import { featureRoutes } from './features/features.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'features',
    // canActivate: [authGuard], // add later
    children: featureRoutes
  },
  {
    path: 'auth',
    children: authRoutes
  }
];
  