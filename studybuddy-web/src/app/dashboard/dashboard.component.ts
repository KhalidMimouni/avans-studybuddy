import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  EnrollmentService,
  MyEnrollment,
} from '../enrollments/enrollment.service';
import { StudyGroupService } from '../study-groups/study-group.service';
import { StudyGroup } from '../study-groups/study-group.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-5xl mx-auto p-6 space-y-8">
      <h1 class="text-2xl font-bold text-gray-900">Mijn overzicht</h1>

      <!-- Ingeschreven studiesessies -->
      <section>
        <h2 class="text-lg font-semibold text-gray-800 mb-3">
          Mijn inschrijvingen
        </h2>
        @if (loadingEnrollments) {
          <p class="text-sm text-gray-500">Laden...</p>
        } @else if (enrollments.length === 0) {
          <p class="text-sm text-gray-500">
            Je bent nog niet ingeschreven voor studiesessies.
          </p>
        } @else {
          <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th class="px-4 py-2 font-medium">Sessie</th>
                  <th class="px-4 py-2 font-medium">Studiegroep</th>
                  <th class="px-4 py-2 font-medium">Datum</th>
                  <th class="px-4 py-2 font-medium">Tijd</th>
                  <th class="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                @for (e of enrollments; track e.id) {
                  <tr class="border-t border-gray-100 hover:bg-gray-50">
                    <td class="px-4 py-2">
                      <a
                        [routerLink]="['/study-sessions', e.studySession.id]"
                        class="text-red-600 hover:underline font-medium">
                        {{ e.studySession.title }}
                      </a>
                    </td>
                    <td class="px-4 py-2">
                      <a
                        [routerLink]="['/study-groups', e.studySession.studyGroup.id]"
                        class="text-red-600 hover:underline">
                        {{ e.studySession.studyGroup.title }}
                      </a>
                    </td>
                    <td class="px-4 py-2 text-gray-600">
                      {{ formatDate(e.studySession.sessionDate) }}
                    </td>
                    <td class="px-4 py-2 text-gray-600">
                      {{ formatTime(e.studySession.startTime) }} - {{ formatTime(e.studySession.endTime) }}
                    </td>
                    <td class="px-4 py-2">
                      <span [class]="statusClasses[computeStatus(e.studySession)]">
                        {{ statusLabels[computeStatus(e.studySession)] }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>

      <!-- Mijn studiegroepen -->
      <section>
        <h2 class="text-lg font-semibold text-gray-800 mb-3">
          Mijn studiegroepen
        </h2>
        @if (loadingGroups) {
          <p class="text-sm text-gray-500">Laden...</p>
        } @else if (myGroups.length === 0) {
          <p class="text-sm text-gray-500">
            Je hebt nog geen studiegroepen aangemaakt.
          </p>
        } @else {
          <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th class="px-4 py-2 font-medium">Groep</th>
                  <th class="px-4 py-2 font-medium">Vak</th>
                  <th class="px-4 py-2 font-medium">Sessies</th>
                </tr>
              </thead>
              <tbody>
                @for (g of myGroups; track g.id) {
                  <tr class="border-t border-gray-100 hover:bg-gray-50">
                    <td class="px-4 py-2">
                      <a
                        [routerLink]="['/study-groups', g.id]"
                        class="text-red-600 hover:underline font-medium">
                        {{ g.title }}
                      </a>
                    </td>
                    <td class="px-4 py-2 text-gray-600">
                      {{ g.course?.name || '-' }}
                    </td>
                    <td class="px-4 py-2 text-gray-600">
                      {{ g.studySessions?.length || 0 }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>

      <!-- Mijn studiesessies (via eigen groepen) -->
      <section>
        <h2 class="text-lg font-semibold text-gray-800 mb-3">
          Mijn studiesessies
        </h2>
        @if (loadingGroups) {
          <p class="text-sm text-gray-500">Laden...</p>
        } @else if (mySessions.length === 0) {
          <p class="text-sm text-gray-500">
            Je hebt nog geen studiesessies aangemaakt.
          </p>
        } @else {
          <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th class="px-4 py-2 font-medium">Sessie</th>
                  <th class="px-4 py-2 font-medium">Studiegroep</th>
                  <th class="px-4 py-2 font-medium">Datum</th>
                  <th class="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                @for (s of mySessions; track s.session.id) {
                  <tr class="border-t border-gray-100 hover:bg-gray-50">
                    <td class="px-4 py-2">
                      <a
                        [routerLink]="['/study-sessions', s.session.id]"
                        class="text-red-600 hover:underline font-medium">
                        {{ s.session.title }}
                      </a>
                    </td>
                    <td class="px-4 py-2">
                      <a
                        [routerLink]="['/study-groups', s.groupId]"
                        class="text-red-600 hover:underline">
                        {{ s.groupTitle }}
                      </a>
                    </td>
                    <td class="px-4 py-2 text-gray-600">
                      {{ formatDate(s.session.sessionDate) }}
                    </td>
                    <td class="px-4 py-2">
                      <span [class]="statusClasses[computeStatus(s.session)]">
                        {{ statusLabels[computeStatus(s.session)] }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  enrollments: MyEnrollment[] = [];
  myGroups: StudyGroup[] = [];
  mySessions: { session: any; groupId: number; groupTitle: string }[] = [];

  loadingEnrollments = true;
  loadingGroups = true;

  statusLabels: Record<string, string> = {
    planned: 'Gepland',
    active: 'Bezig',
    completed: 'Afgerond',
    cancelled: 'Geannuleerd',
  };

  statusClasses: Record<string, string> = {
    planned:
      'inline-block px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800',
    active:
      'inline-block px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-800',
    completed:
      'inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-800',
    cancelled:
      'inline-block px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-800',
  };

  constructor(
    private enrollmentService: EnrollmentService,
    private studyGroupService: StudyGroupService,
  ) {}

  ngOnInit() {
    this.enrollmentService.getMyEnrollments().subscribe({
      next: (data) => {
        this.enrollments = data;
        this.loadingEnrollments = false;
      },
      error: () => (this.loadingEnrollments = false),
    });

    this.studyGroupService.findMine().subscribe({
      next: (groups) => {
        this.myGroups = groups;
        this.mySessions = [];
        for (const g of groups) {
          for (const s of g.studySessions || []) {
            this.mySessions.push({
              session: s,
              groupId: g.id,
              groupTitle: g.title,
            });
          }
        }
        this.mySessions.sort(
          (a, b) =>
            new Date(b.session.sessionDate).getTime() -
            new Date(a.session.sessionDate).getTime(),
        );
        this.loadingGroups = false;
      },
      error: () => (this.loadingGroups = false),
    });
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  formatTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  }

  computeStatus(session: {
    status: string;
    sessionDate: string;
    startTime: string;
    endTime: string;
  }): string {
    if (session.status === 'cancelled') return 'cancelled';
    const now = new Date();
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    if (now >= start && now <= end) return 'active';
    if (now > end) return 'completed';
    return 'planned';
  }
}
