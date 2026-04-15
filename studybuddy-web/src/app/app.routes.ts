import { Route } from '@angular/router';
import { authGuard } from './shared/auth.guard';
import { guestGuard } from './shared/guest.guard';

export const appRoutes: Route[] = [
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./auth/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./home.component').then((m) => m.HomeComponent),
  },
  { path: '**', redirectTo: '' },
];
