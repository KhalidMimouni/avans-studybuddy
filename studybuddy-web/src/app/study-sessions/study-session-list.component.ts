import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudySessionService } from './study-session.service';
import { StudySession } from './study-session.model';

@Component({
  selector: 'app-study-session-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-[calc(100vh-3.5rem)]">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Studiesessies</h1>

        @if (loading) {
          <p class="text-gray-500">Studiesessies laden...</p>
        } @else if (sessions.length === 0) {
          <div class="bg-white rounded-lg shadow p-8 text-center">
            <p class="text-gray-500">Er zijn nog geen studiesessies beschikbaar.</p>
          </div>
        } @else {
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            @for (session of sessions; track session.id) {
              <a [routerLink]="['/study-sessions', session.id]"
                class="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow block">
                <div class="flex items-start justify-between mb-1">
                  <h2 class="text-lg font-semibold text-gray-900">{{ session.title }}</h2>
                  <span class="text-xs px-2 py-0.5 rounded shrink-0 ml-2"
                    [class]="session.status === 'planned'
                      ? 'bg-blue-100 text-blue-800'
                      : session.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'">
                    {{ session.status }}
                  </span>
                </div>

                @if (session.studyGroup) {
                  <p class="text-sm text-blue-600 font-medium mb-2">
                    {{ session.studyGroup.title }}
                  </p>
                }

                <div class="flex flex-wrap gap-3 text-xs text-gray-500 mt-3">
                  <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ session.sessionDate | date:'d MMM yyyy' }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ session.startTime | date:'HH:mm' }} - {{ session.endTime | date:'HH:mm' }}
                  </span>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class StudySessionListComponent implements OnInit {
  sessions: StudySession[] = [];
  loading = true;

  constructor(private studySessionService: StudySessionService) {}

  ngOnInit() {
    this.studySessionService.findAll().subscribe({
      next: (data) => {
        this.sessions = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
