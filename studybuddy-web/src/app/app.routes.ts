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
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./courses/courses-layout.component').then((m) => m.CoursesLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./courses/course-list.component').then((m) => m.CourseListComponent),
      },
      {
        path: 'new',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./courses/course-create.component').then((m) => m.CourseCreateComponent),
      },
      {
        path: ':id/edit',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./courses/course-edit.component').then((m) => m.CourseEditComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./courses/course-detail.component').then((m) => m.CourseDetailComponent),
      },
    ],
  },
  {
    path: 'study-groups',
    loadComponent: () =>
      import('./study-groups/study-groups-layout.component').then((m) => m.StudyGroupsLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./study-groups/study-group-list.component').then((m) => m.StudyGroupListComponent),
      },
      {
        path: 'new',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./study-groups/study-group-create.component').then((m) => m.StudyGroupCreateComponent),
      },
      {
        path: ':id/edit',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./study-groups/study-group-edit.component').then((m) => m.StudyGroupEditComponent),
      },
      {
        path: ':groupId/sessions/new',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./study-sessions/study-session-create.component').then((m) => m.StudySessionCreateComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./study-groups/study-group-detail.component').then((m) => m.StudyGroupDetailComponent),
      },
    ],
  },
  {
    path: 'study-sessions',
    loadComponent: () =>
      import('./study-sessions/study-sessions-layout.component').then((m) => m.StudySessionsLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./study-sessions/study-session-list.component').then((m) => m.StudySessionListComponent),
      },
      {
        path: ':id/edit',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./study-sessions/study-session-edit.component').then((m) => m.StudySessionEditComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./study-sessions/study-session-detail.component').then((m) => m.StudySessionDetailComponent),
      },
    ],
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./home.component').then((m) => m.HomeComponent),
  },
  { path: '**', redirectTo: '' },
];
