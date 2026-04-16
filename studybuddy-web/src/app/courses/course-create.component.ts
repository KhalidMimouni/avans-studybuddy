import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CourseService } from './course.service';

@Component({
  selector: 'app-course-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-[calc(100vh-3.5rem)]">
      <div class="max-w-2xl mx-auto px-4 py-8">
        <a routerLink="/courses"
          class="text-sm text-red-600 hover:underline mb-4 inline-block">
          Terug naar vakken
        </a>

        <div class="bg-white rounded-lg shadow p-8">
          <h1 class="text-2xl font-bold text-gray-900 mb-6">Vak aanmaken</h1>

          @if (errorMessage) {
            <div class="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
              {{ errorMessage }}
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Naam</label>
              <input id="name" formControlName="name" type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              @if (form.get('name')?.touched && form.get('name')?.hasError('required')) {
                <p class="text-red-600 text-xs mt-1">Verplicht</p>
              }
            </div>

            <div class="mb-4">
              <label for="code" class="block text-sm font-medium text-gray-700 mb-1">Code</label>
              <input id="code" formControlName="code" type="text" placeholder="bijv. CSWF"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              @if (form.get('code')?.touched && form.get('code')?.hasError('required')) {
                <p class="text-red-600 text-xs mt-1">Verplicht</p>
              }
            </div>

            <div class="mb-4">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
              <textarea id="description" formControlName="description" rows="3"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"></textarea>
              @if (form.get('description')?.touched && form.get('description')?.hasError('required')) {
                <p class="text-red-600 text-xs mt-1">Verplicht</p>
              }
            </div>

            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label for="studyYear" class="block text-sm font-medium text-gray-700 mb-1">Studiejaar</label>
                <select id="studyYear" formControlName="studyYear"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                  <option [ngValue]="1">Jaar 1</option>
                  <option [ngValue]="2">Jaar 2</option>
                  <option [ngValue]="3">Jaar 3</option>
                  <option [ngValue]="4">Jaar 4</option>
                </select>
              </div>
              <div>
                <label for="semester" class="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <select id="semester" formControlName="semester"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                  <option [ngValue]="1">Semester 1</option>
                  <option [ngValue]="2">Semester 2</option>
                </select>
              </div>
            </div>

            <button type="submit" [disabled]="form.invalid || submitting"
              class="w-full bg-red-600 text-white py-2 px-4 rounded font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ submitting ? 'Bezig...' : 'Vak aanmaken' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class CourseCreateComponent {
  form: FormGroup;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private courseService: CourseService,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      description: ['', Validators.required],
      studyYear: [1, Validators.required],
      semester: [1, Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.submitting = true;
    this.errorMessage = '';

    this.courseService.create(this.form.value).subscribe({
      next: (created) => {
        this.router.navigate(['/courses', created.id]);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage =
          err.error?.message || 'Aanmaken mislukt. Probeer het opnieuw.';
      },
    });
  }
}
