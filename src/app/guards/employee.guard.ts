// role.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const role = localStorage.getItem('ROLE');
  const allowedRoles = route.data?.['roles'] as string[];

  if (!role) {
    router.navigate(['/login']);
    return false;
  }

  if (allowedRoles.includes(role)) {
    return true;
  }

  if (role === 'employee') {
    router.navigate(['/features/apply-leave']);
  } else {
    router.navigate(['/features/users']);
  }
  return false;

  return false;
};