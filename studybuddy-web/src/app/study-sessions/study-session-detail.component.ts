import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudySessionService } from './study-session.service';
import { StudySession } from './study-session.model';
import { AuthService } from '../shared/auth.service';
import { EnrollmentService } from '../enrollments/enrollment.service';

@Component({
  selector: 'app-study-session-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-[calc(100vh-3.5rem)]">
      <div class="max-w-4xl mx-auto px-4 py-8">
        <a routerLink="/study-sessions" class="text-sm text-blue-600 hover:underline mb-4 inline-block">
          Terug naar studiesessies
        </a>

        @if (loading) {
          <p class="text-gray-500">Studiesessie laden...</p>
        } @else if (!session) {
          <div class="bg-white rounded-lg shadow p-8 text-center">
            <p class="text-gray-500">Studiesessie niet gevonden.</p>
          </div>
        } @else {
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <div class="flex items-start justify-between mb-2">
              <h1 class="text-2xl font-bold text-gray-900">{{ session.title }}</h1>
              <div class="flex items-center gap-2 shrink-0 ml-3">
                <span class="text-xs px-2 py-0.5 rounded"
                  [class]="session.status === 'planned'
                    ? 'bg-blue-100 text-blue-800'
                    : session.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'">
                  {{ session.status }}
                </span>
                @if (isOwner) {
                  <a [routerLink]="['/study-sessions', session.id, 'edit']"
                    class="text-xs bg-blue-600 text-white px-3 py-1 rounded font-medium hover:bg-blue-700">
                    Wijzigen
                  </a>
                  <button (click)="confirmDelete()"
                    [disabled]="deleting"
                    class="text-xs bg-red-600 text-white px-3 py-1 rounded font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ deleting ? 'Bezig...' : 'Verwijderen' }}
                  </button>
                }
              </div>
            </div>

            @if (deleteError) {
              <div class="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
                {{ deleteError }}
              </div>
            }

            @if (session.studyGroup) {
              <a [routerLink]="['/study-groups', session.studyGroup.id]"
                class="text-sm text-blue-600 hover:underline font-medium mb-4 inline-block">
                {{ session.studyGroup.title }}
              </a>
            }

            <div class="flex flex-wrap gap-6 text-sm text-gray-600 mt-4">
              <div>
                <span class="font-medium text-gray-900">Datum</span>
                <p>{{ session.sessionDate | date:'d MMMM yyyy' }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-900">Tijdstip</span>
                <p>{{ session.startTime | date:'HH:mm' }} - {{ session.endTime | date:'HH:mm' }}</p>
              </div>
              @if (session.studyGroup?.meetingLocation) {
                <div>
                  <span class="font-medium text-gray-900">Locatie</span>
                  <p>{{ session.studyGroup?.meetingLocation }}</p>
                </div>
              }
              @if (session.studyGroup?.owner) {
                <div>
                  <span class="font-medium text-gray-900">Eigenaar</span>
                  <p>{{ session.studyGroup?.owner?.firstName }} {{ session.studyGroup?.owner?.lastName }}</p>
                </div>
              }
            </div>

            @if (session.notes) {
              <div class="mt-6">
                <span class="text-sm font-medium text-gray-900">Notities</span>
                <p class="text-sm text-gray-700 mt-1">{{ session.notes }}</p>
              </div>
            }
          </div>

          @if (auth.isLoggedIn() && !isOwner) {
            <div class="bg-white rounded-lg shadow p-4 mb-6 flex items-center justify-between">
              @if (enrolling) {
                <p class="text-sm text-gray-500">Bezig...</p>
              } @else if (isEnrolled) {
                <p class="text-sm text-gray-700">Je bent aangemeld voor deze sessie.</p>
                <button (click)="unenroll()"
                  class="text-sm bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700">
                  Afmelden
                </button>
              } @else {
                <p class="text-sm text-gray-700">Je bent nog niet aangemeld voor deze sessie.</p>
                <button (click)="enroll()"
                  class="text-sm bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700">
                  Aanmelden
                </button>
              }
            </div>
            @if (enrollError) {
              <div class="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
                {{ enrollError }}
              </div>
            }
          }

          @if (session.enrollments && session.enrollments.length > 0) {
            <h2 class="text-lg font-semibold text-gray-900 mb-3">
              Deelnemers ({{ session.enrollments.length }})
            </h2>
            <div class="bg-white rounded-lg shadow divide-y divide-gray-100">
              @for (enrollment of session.enrollments; track enrollment.id) {
                <div class="flex items-center justify-between px-5 py-3">
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ enrollment.user.firstName }} {{ enrollment.user.lastName }}
                    </p>
                    <p class="text-xs text-gray-500">{{ enrollment.user.email }}</p>
                  </div>
                  <span class="text-xs px-2 py-0.5 rounded"
                    [class]="enrollment.attendanceStatus === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : enrollment.attendanceStatus === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-600'">
                    {{ enrollment.attendanceStatus }}
                  </span>
                </div>
              }
            </div>
          } @else {
            <div class="bg-white rounded-lg shadow p-6 text-center">
              <p class="text-gray-500">Er zijn nog geen deelnemers voor deze sessie.</p>
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class StudySessionDetailComponent implements OnInit {
  session: StudySession | null = null;
  loading = true;
  isOwner = false;
  isEnrolled = false;
  deleting = false;
  deleteError = '';
  enrolling = false;
  enrollError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studySessionService: StudySessionService,
    public auth: AuthService,
    private enrollmentService: EnrollmentService,
  ) {}

  ngOnInit() {
    this.loadSession();
  }

  private loadSession() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.studySessionService.findOne(id).subscribe({
      next: (data) => {
        this.session = data;
        const currentUser = this.auth.user();
        this.isOwner = !!currentUser && !!data.studyGroup?.owner && currentUser.id === data.studyGroup.owner.id;
        this.isEnrolled = !!currentUser && !!data.enrollments?.some(e => e.user.id === currentUser.id);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  enroll() {
    if (!this.session) return;
    this.enrolling = true;
    this.enrollError = '';

    this.enrollmentService.enroll(this.session.id).subscribe({
      next: () => {
        this.enrolling = false;
        this.loadSession();
      },
      error: (err) => {
        this.enrolling = false;
        this.enrollError = err.error?.message || 'Aanmelden mislukt. Probeer het opnieuw.';
      },
    });
  }

  unenroll() {
    if (!this.session) return;
    this.enrolling = true;
    this.enrollError = '';

    this.enrollmentService.unenroll(this.session.id).subscribe({
      next: () => {
        this.enrolling = false;
        this.loadSession();
      },
      error: (err) => {
        this.enrolling = false;
        this.enrollError = err.error?.message || 'Afmelden mislukt. Probeer het opnieuw.';
      },
    });
  }

  confirmDelete() {
    if (!this.session) return;
    if (!confirm(`Weet je zeker dat je "${this.session.title}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`)) {
      return;
    }

    this.deleting = true;
    this.deleteError = '';

    this.studySessionService.remove(this.session.id).subscribe({
      next: () => {
        this.router.navigate(['/study-sessions']);
      },
      error: (err) => {
        this.deleting = false;
        this.deleteError =
          err.error?.message || 'Verwijderen mislukt. Probeer het opnieuw.';
      },
    });
  }
}
