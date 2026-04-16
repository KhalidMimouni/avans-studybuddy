import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudySessionService } from './study-session.service';
import { StudyGroupService } from '../study-groups/study-group.service';
import { StudyGroup } from '../study-groups/study-group.model';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-study-session-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-[calc(100vh-3.5rem)]">
      <div class="max-w-2xl mx-auto px-4 py-8">
        @if (group) {
          <a [routerLink]="['/study-groups', group.id]"
            class="text-sm text-blue-600 hover:underline mb-4 inline-block">
            Terug naar {{ group.title }}
          </a>
        } @else {
          <a routerLink="/study-sessions"
            class="text-sm text-blue-600 hover:underline mb-4 inline-block">
            Terug naar studiesessies
          </a>
        }

        @if (loadingGroup) {
          <p class="text-gray-500">Laden...</p>
        } @else if (forbidden) {
          <div class="bg-white rounded-lg shadow p-8 text-center">
            <p class="text-red-600 font-medium">Je hebt geen toestemming om sessies aan te maken voor deze studiegroep.</p>
          </div>
        } @else if (!group) {
          <div class="bg-white rounded-lg shadow p-8 text-center">
            <p class="text-gray-500">Studiegroep niet gevonden.</p>
          </div>
        } @else {
          <div class="bg-white rounded-lg shadow p-8">
            <h1 class="text-2xl font-bold text-gray-900 mb-1">Studiesessie plannen</h1>
            <p class="text-sm text-gray-500 mb-6">voor {{ group.title }}</p>

            @if (errorMessage) {
              <div class="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
                {{ errorMessage }}
              </div>
            }

            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="mb-4">
                <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Titel</label>
                <input id="title" formControlName="title" type="text"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                @if (form.get('title')?.touched && form.get('title')?.hasError('required')) {
                  <p class="text-red-600 text-xs mt-1">Verplicht</p>
                }
              </div>

              <div class="mb-4">
                <label for="sessionDate" class="block text-sm font-medium text-gray-700 mb-1">Datum</label>
                <input id="sessionDate" formControlName="sessionDate" type="date"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                @if (form.get('sessionDate')?.touched && form.get('sessionDate')?.hasError('required')) {
                  <p class="text-red-600 text-xs mt-1">Verplicht</p>
                }
              </div>

              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label for="startTime" class="block text-sm font-medium text-gray-700 mb-1">Begintijd</label>
                  <input id="startTime" formControlName="startTime" type="time"
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  @if (form.get('startTime')?.touched && form.get('startTime')?.hasError('required')) {
                    <p class="text-red-600 text-xs mt-1">Verplicht</p>
                  }
                </div>
                <div>
                  <label for="endTime" class="block text-sm font-medium text-gray-700 mb-1">Eindtijd</label>
                  <input id="endTime" formControlName="endTime" type="time"
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  @if (form.get('endTime')?.touched && form.get('endTime')?.hasError('required')) {
                    <p class="text-red-600 text-xs mt-1">Verplicht</p>
                  }
                </div>
              </div>

              @if (form.hasError('endBeforeStart')) {
                <p class="text-red-600 text-xs mb-4">Eindtijd moet na begintijd liggen</p>
              }

              <div class="mb-4">
                <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select id="status" formControlName="status"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="planned">Gepland</option>
                  <option value="in_progress">Bezig</option>
                  <option value="completed">Afgerond</option>
                  <option value="cancelled">Geannuleerd</option>
                </select>
              </div>

              <div class="mb-6">
                <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Notities</label>
                <textarea id="notes" formControlName="notes" rows="3"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optioneel: onderwerpen, materiaal, afspraken..."></textarea>
              </div>

              <button type="submit" [disabled]="form.invalid || submitting"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ submitting ? 'Bezig...' : 'Sessie aanmaken' }}
              </button>
            </form>
          </div>
        }
      </div>
    </div>
  `,
})
export class StudySessionCreateComponent implements OnInit {
  form: FormGroup;
  group: StudyGroup | null = null;
  loadingGroup = true;
  forbidden = false;
  submitting = false;
  errorMessage = '';

  private groupId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private studySessionService: StudySessionService,
    private studyGroupService: StudyGroupService,
    private auth: AuthService,
  ) {
    this.form = this.fb.group(
      {
        title: ['', Validators.required],
        sessionDate: ['', Validators.required],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        status: ['planned'],
        notes: [''],
      },
      { validators: [this.endAfterStartValidator] },
    );
  }

  ngOnInit() {
    this.groupId = Number(this.route.snapshot.paramMap.get('groupId'));

    this.studyGroupService.findOne(this.groupId).subscribe({
      next: (data) => {
        const currentUser = this.auth.user();
        if (!currentUser || currentUser.id !== data.ownerId) {
          this.forbidden = true;
        }
        this.group = data;
        this.loadingGroup = false;
      },
      error: () => {
        this.loadingGroup = false;
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.submitting = true;
    this.errorMessage = '';

    const { title, sessionDate, startTime, endTime, status, notes } = this.form.value;
    const startISO = new Date(`${sessionDate}T${startTime}`).toISOString();
    const endISO = new Date(`${sessionDate}T${endTime}`).toISOString();

    this.studySessionService
      .create({
        title,
        sessionDate: new Date(sessionDate).toISOString(),
        startTime: startISO,
        endTime: endISO,
        status: status || undefined,
        notes: notes || undefined,
        studyGroupId: this.groupId,
      })
      .subscribe({
        next: (created) => {
          this.router.navigate(['/study-sessions', created.id]);
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage =
            err.error?.message || 'Aanmaken mislukt. Probeer het opnieuw.';
        },
      });
  }

  private endAfterStartValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startTime')?.value;
    const end = group.get('endTime')?.value;
    if (start && end && end <= start) {
      return { endBeforeStart: true };
    }
    return null;
  }
}
