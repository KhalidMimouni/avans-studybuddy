import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudyGroupService } from './study-group.service';
import { StudyGroup } from './study-group.model';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-study-group-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-[calc(100vh-3.5rem)]">
      <div class="max-w-2xl mx-auto px-4 py-8">
        @if (group) {
          <a [routerLink]="['/study-groups', group.id]"
            class="text-sm text-red-600 hover:underline mb-4 inline-block">
            Terug naar studiegroep
          </a>
        } @else {
          <a routerLink="/study-groups"
            class="text-sm text-red-600 hover:underline mb-4 inline-block">
            Terug naar studiegroepen
          </a>
        }

        @if (loading) {
          <p class="text-gray-500">Studiegroep laden...</p>
        } @else if (forbidden) {
          <div class="bg-white rounded-lg shadow p-8 text-center">
            <p class="text-red-600 font-medium mb-2">Geen toegang</p>
            <p class="text-gray-500">Alleen de eigenaar kan deze studiegroep wijzigen.</p>
          </div>
        } @else if (!group) {
          <div class="bg-white rounded-lg shadow p-8 text-center">
            <p class="text-gray-500">Studiegroep niet gevonden.</p>
          </div>
        } @else {
          <div class="bg-white rounded-lg shadow p-8">
            <h1 class="text-2xl font-bold text-gray-900 mb-6">Studiegroep wijzigen</h1>

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
export class StudyGroupEditComponent implements OnInit {
  form: FormGroup;
  group: StudyGroup | null = null;
  loading = true;
  forbidden = false;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private studyGroupService: StudyGroupService,
    private auth: AuthService,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      meetingLocation: ['', Validators.required],
      maxMembers: [null, [Validators.required, Validators.min(2)]],
    });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.studyGroupService.findOne(id).subscribe({
      next: (group) => {
        this.group = group;
        const currentUser = this.auth.user();
        if (!currentUser || currentUser.id !== group.ownerId) {
          this.forbidden = true;
          this.loading = false;
          return;
        }
        this.form.patchValue({
          title: group.title,
          description: group.description,
          meetingLocation: group.meetingLocation,
          maxMembers: group.maxMembers,
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (this.form.invalid || !this.group) return;

    this.submitting = true;
    this.errorMessage = '';

    const payload = {
      ...this.form.value,
      maxMembers: Number(this.form.value.maxMembers),
    };

    this.studyGroupService.update(this.group.id, payload).subscribe({
      next: () => {
        this.router.navigate(['/study-groups', this.group!.id]);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage =
          err.error?.message || 'Wijzigen mislukt. Probeer het opnieuw.';
      },
    });
  }
}
