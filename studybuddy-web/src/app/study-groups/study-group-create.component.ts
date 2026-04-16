import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StudyGroupService } from './study-group.service';
import { CourseService } from '../courses/course.service';
import { Course } from '../courses/course.model';

@Component({
  selector: 'app-study-group-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-[calc(100vh-3.5rem)]">
      <div class="max-w-2xl mx-auto px-4 py-8">
        <a routerLink="/study-groups" class="text-sm text-red-600 hover:underline mb-4 inline-block">
          Terug naar studiegroepen
        </a>

        <div class="bg-white rounded-lg shadow p-8">
          <h1 class="text-2xl font-bold text-gray-900 mb-6">Studiegroep aanmaken</h1>

          @if (errorMessage) {
            <div class="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
              {{ errorMessage }}
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Titel</label>
              <input id="title" formControlName="title" type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              @if (form.get('title')?.touched && form.get('title')?.hasError('required')) {
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

            <div class="mb-4">
              <label for="courseId" class="block text-sm font-medium text-gray-700 mb-1">Vak</label>
              @if (coursesLoading) {
                <p class="text-sm text-gray-400">Vakken laden...</p>
              } @else {
                <select id="courseId" formControlName="courseId"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                  <option value="" disabled>Kies een vak</option>
                  @for (course of courses; track course.id) {
                    <option [value]="course.id">{{ course.name }} ({{ course.code }})</option>
                  }
                </select>
              }
              @if (form.get('courseId')?.touched && form.get('courseId')?.hasError('required')) {
                <p class="text-red-600 text-xs mt-1">Verplicht</p>
              }
            </div>

            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label for="meetingLocation" class="block text-sm font-medium text-gray-700 mb-1">Locatie</label>
                <input id="meetingLocation" formControlName="meetingLocation" type="text"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                @if (form.get('meetingLocation')?.touched && form.get('meetingLocation')?.hasError('required')) {
                  <p class="text-red-600 text-xs mt-1">Verplicht</p>
                }
              </div>
              <div>
                <label for="maxMembers" class="block text-sm font-medium text-gray-700 mb-1">Max leden</label>
                <input id="maxMembers" formControlName="maxMembers" type="number" min="2"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                @if (form.get('maxMembers')?.touched && form.get('maxMembers')?.hasError('required')) {
                  <p class="text-red-600 text-xs mt-1">Verplicht</p>
                }
                @if (form.get('maxMembers')?.touched && form.get('maxMembers')?.hasError('min')) {
                  <p class="text-red-600 text-xs mt-1">Minimaal 2</p>
                }
              </div>
            </div>

            <button type="submit" [disabled]="form.invalid || submitting"
              class="w-full bg-red-600 text-white py-2 px-4 rounded font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ submitting ? 'Bezig...' : 'Studiegroep aanmaken' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class StudyGroupCreateComponent implements OnInit {
  form: FormGroup;
  courses: Course[] = [];
  coursesLoading = true;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private studyGroupService: StudyGroupService,
    private courseService: CourseService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      courseId: ['', Validators.required],
      meetingLocation: ['', Validators.required],
      maxMembers: [null, [Validators.required, Validators.min(2)]],
    });
  }

  ngOnInit() {
    this.courseService.findAll().subscribe({
      next: (data) => {
        this.courses = data;
        this.coursesLoading = false;
      },
      error: () => {
        this.coursesLoading = false;
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.submitting = true;
    this.errorMessage = '';

    const payload = {
      ...this.form.value,
      courseId: Number(this.form.value.courseId),
      maxMembers: Number(this.form.value.maxMembers),
    };

    this.studyGroupService.create(payload).subscribe({
      next: (created) => {
        this.router.navigate(['/study-groups', created.id]);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage =
          err.error?.message || 'Aanmaken mislukt. Probeer het opnieuw.';
      },
    });
  }
}
