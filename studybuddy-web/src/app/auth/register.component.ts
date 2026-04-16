import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div class="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Account aanmaken</h1>

        @if (errorMessage) {
          <div class="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
            {{ errorMessage }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">Voornaam</label>
              <input id="firstName" formControlName="firstName" type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              @if (form.get('firstName')?.touched && form.get('firstName')?.hasError('required')) {
                <p class="text-red-600 text-xs mt-1">Verplicht</p>
              }
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Achternaam</label>
              <input id="lastName" formControlName="lastName" type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              @if (form.get('lastName')?.touched && form.get('lastName')?.hasError('required')) {
                <p class="text-red-600 text-xs mt-1">Verplicht</p>
              }
            </div>
          </div>

          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-mailadres</label>
            <input id="email" formControlName="email" type="email"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            @if (form.get('email')?.touched && form.get('email')?.hasError('email')) {
              <p class="text-red-600 text-xs mt-1">Ongeldig e-mailadres</p>
            }
          </div>

          <div class="mb-4">
            <label for="studentNumber" class="block text-sm font-medium text-gray-700 mb-1">Studentnummer</label>
            <input id="studentNumber" formControlName="studentNumber" type="text"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            @if (form.get('studentNumber')?.touched && form.get('studentNumber')?.hasError('required')) {
              <p class="text-red-600 text-xs mt-1">Verplicht</p>
            }
          </div>

          <div class="mb-4">
            <label for="program" class="block text-sm font-medium text-gray-700 mb-1">Opleiding</label>
            <input id="program" formControlName="program" type="text"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            @if (form.get('program')?.touched && form.get('program')?.hasError('required')) {
              <p class="text-red-600 text-xs mt-1">Verplicht</p>
            }
          </div>

          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Wachtwoord</label>
            <input id="password" formControlName="password" type="password"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            @if (form.get('password')?.touched && form.get('password')?.hasError('minlength')) {
              <p class="text-red-600 text-xs mt-1">Minimaal 6 tekens</p>
            }
          </div>

          <button type="submit" [disabled]="form.invalid || submitting"
            class="w-full bg-red-600 text-white py-2 px-4 rounded font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ submitting ? 'Bezig...' : 'Registreren' }}
          </button>
        </form>

        <p class="mt-4 text-sm text-gray-600 text-center">
          Heb je al een account?
          <a routerLink="/login" class="text-red-600 hover:underline">Inloggen</a>
        </p>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  form: FormGroup;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      studentNumber: ['', Validators.required],
      program: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.submitting = true;
    this.errorMessage = '';

    this.auth.register(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage =
          err.error?.message || 'Registratie mislukt. Probeer het opnieuw.';
      },
    });
  }
}
