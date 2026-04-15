import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  studentNumber: string;
  program: string;
}

interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  studentNumber: string;
  program: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<AuthUser | null>(null);

  user = this.currentUser.asReadonly();
  isLoggedIn = computed(() => this.currentUser() !== null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromStorage();
  }

  register(payload: RegisterPayload) {
    return this.http.post<AuthResponse>('/api/auth/register', payload).pipe(
      tap((res) => this.handleAuth(res)),
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>('/api/auth/login', { email, password }).pipe(
      tap((res) => this.handleAuth(res)),
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private handleAuth(res: AuthResponse) {
    localStorage.setItem('token', res.access_token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  private loadFromStorage() {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        this.currentUser.set(JSON.parse(raw));
      } catch {
        this.logout();
      }
    }
  }
}
