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
    path: 'courses',
    loadComponent: () =>
      import('./courses/course-list.component').then((m) => m.CourseListComponent),
  },
  {
    path: 'courses/:id',
    loadComponent: () =>
      import('./courses/course-detail.component').then((m) => m.CourseDetailComponent),
  },
  {
    path: 'study-groups',
    loadComponent: () =>
      import('./study-groups/study-group-list.component').then((m) => m.StudyGroupListComponent),
  },
  {
    path: 'study-groups/:id',
    loadComponent: () =>
      import('./study-groups/study-group-detail.component').then((m) => m.StudyGroupDetailComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./home.component').then((m) => m.HomeComponent),
  },
  { path: '**', redirectTo: '' },
];
