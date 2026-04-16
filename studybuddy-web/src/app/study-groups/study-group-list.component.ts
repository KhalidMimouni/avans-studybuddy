import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudyGroupService } from './study-group.service';
import { StudyGroup } from './study-group.model';

@Component({
  selector: 'app-study-group-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-[calc(100vh-3.5rem)]">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Studiegroepen</h1>

        @if (loading) {
          <p class="text-gray-500">Studiegroepen laden...</p>
        } @else if (groups.length === 0) {
          <div class="bg-white rounded-lg shadow p-8 text-center">
            <p class="text-gray-500">Er zijn nog geen studiegroepen beschikbaar.</p>
          </div>
        } @else {
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            @for (group of groups; track group.id) {
              <a [routerLink]="['/study-groups', group.id]"
                class="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow block">
                <h2 class="text-lg font-semibold text-gray-900 mb-1">{{ group.title }}</h2>

                @if (group.course) {
                  <p class="text-sm text-blue-600 font-medium mb-2">
                    {{ group.course.name }}
                    <span class="text-gray-400 font-normal">{{ group.course.code }}</span>
                  </p>
                }

                <p class="text-sm text-gray-500 line-clamp-2 mb-3">{{ group.description }}</p>

                <div class="flex gap-4 text-xs text-gray-500">
                  <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ group.meetingLocation }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Max {{ group.maxMembers }} leden
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
export class StudyGroupListComponent implements OnInit {
  groups: StudyGroup[] = [];
  loading = true;

  constructor(private studyGroupService: StudyGroupService) {}

  ngOnInit() {
    this.studyGroupService.findAll().subscribe({
      next: (data) => {
        this.groups = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
