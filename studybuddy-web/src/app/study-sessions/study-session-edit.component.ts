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
import { StudySession } from './study-session.model';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-study-session-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-[calc(100vh-3.5rem)]">
      <div class="max-w-2xl mx-auto px-4 py-8">
        @if (session) {
          <a [routerLink]="['/study-sessions', session.id]"
            class="text-sm text-red-600 hover:underline mb-4 inline-block">
            Terug naar studiesessie
          </a>
        } @else {
          <a routerLink="/study-sessions"
            class="text-sm text-red-600 hover:underline mb-4 inline-block">
            Terug naar studiesessies
          </a>
        }

        @if (loading) {
          <p class="text-gray-500">Studiesessie laden...</p>
        } @else if (forbidden) {
          <div class="bg-white rounded-lg shadow p-8 text-center">
            <p class="text-red-600 font-medium mb-2">Geen toegang</p>
            <p class="text-gray-500">Alleen de eigenaar van de studiegroep kan deze sessie wijzigen.</p>
          </div>
        } @else if (!session) {
          <div class="bg-white rounded-lg shadow p-8 text-center">
            <p class="text-gray-500">Studiesessie niet gevonden.</p>
          </div>
        } @else {
          <div class="bg-white rounded-lg shadow p-8">
            <h1 class="text-2xl font-bold text-gray-900 mb-1">Studiesessie wijzigen</h1>
            @if (session.studyGroup) {
              <p class="text-sm text-gray-500 mb-6">{{ session.studyGroup.title }}</p>
            }

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
                <label for="sessionDate" class="block text-sm font-medium text-gray-700 mb-1">Datum</label>
                <input id="sessionDate" formControlName="sessionDate" type="date"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                @if (form.get('sessionDate')?.touched && form.get('sessionDate')?.hasError('required')) {
                  <p class="text-red-600 text-xs mt-1">Verplicht</p>
                }
                @if (form.hasError('dateInPast')) {
                  <p class="text-red-600 text-xs mt-1">Datum mag niet in het verleden liggen</p>
                }
              </div>

              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label for="startTime" class="block text-sm font-medium text-gray-700 mb-1">Begintijd</label>
                  <input id="startTime" formControlName="startTime" type="time"
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                  @if (form.get('startTime')?.touched && form.get('startTime')?.hasError('required')) {
                    <p class="text-red-600 text-xs mt-1">Verplicht</p>
                  }
                </div>
                <div>
                  <label for="endTime" class="block text-sm font-medium text-gray-700 mb-1">Eindtijd</label>
                  <input id="endTime" formControlName="endTime" type="time"
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
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
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                  <option value="planned">Gepland</option>
                  <option value="cancelled">Geannuleerd</option>
                </select>
              </div>

              <div class="mb-6">
                <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Notities</label>
                <textarea id="notes" formControlName="notes" rows="3"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Optioneel: onderwerpen, materiaal, afspraken..."></textarea>
              </div>

              <button type="submit" [disabled]="form.invalid || form.pristine || submitting"
                class="w-full bg-red-600 text-white py-2 px-4 rounded font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ submitting ? 'Bezig...' : 'Wijzigingen opslaan' }}
              </button>
            </form>
          </div>
        }
      </div>
    </div>
  `,
})
export class StudySessionEditComponent implements OnInit {
  form: FormGroup;
  session: StudySession | null = null;
  loading = true;
  forbidden = false;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private studySessionService: StudySessionService,
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
      { validators: [this.endAfterStartValidator, this.notInPastValidator] },
    );
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.studySessionService.findOne(id).subscribe({
      next: (session) => {
        this.session = session;
        const currentUser = this.auth.user();
        if (!currentUser || !session.studyGroup?.owner || currentUser.id !== session.studyGroup.owner.id) {
          this.forbidden = true;
          this.loading = false;
          return;
        }
        this.form.patchValue({
          title: session.title,
          sessionDate: this.toDateInput(session.sessionDate),
          startTime: this.toTimeInput(session.startTime),
          endTime: this.toTimeInput(session.endTime),
          status: session.status || 'planned',
          notes: session.notes || '',
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (this.form.invalid || !this.session) return;

    this.submitting = true;
    this.errorMessage = '';

    const { title, sessionDate, startTime, endTime, status, notes } = this.form.value;
    const startISO = new Date(`${sessionDate}T${startTime}`).toISOString();
    const endISO = new Date(`${sessionDate}T${endTime}`).toISOString();

    this.studySessionService
      .update(this.session.id, {
        title,
        sessionDate: new Date(sessionDate).toISOString(),
        startTime: startISO,
        endTime: endISO,
        status: status || undefined,
        notes: notes ?? '',
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/study-sessions', this.session!.id]);
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage =
            err.error?.message || 'Wijzigen mislukt. Probeer het opnieuw.';
        },
      });
  }

  private toDateInput(iso: string): string {
    return iso.substring(0, 10);
  }

  private toTimeInput(iso: string): string {
    const d = new Date(iso);
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  private endAfterStartValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startTime')?.value;
    const end = group.get('endTime')?.value;
    if (start && end && end <= start) {
      return { endBeforeStart: true };
    }
    return null;
  }

  private notInPastValidator(group: AbstractControl): ValidationErrors | null {
    const date = group.get('sessionDate')?.value;
    if (!date) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(date) < today) {
      return { dateInPast: true };
    }
    return null;
  }
}
