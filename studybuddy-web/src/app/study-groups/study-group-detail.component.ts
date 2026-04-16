import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StudyGroupService } from './study-group.service';
import { StudyGroup } from './study-group.model';

@Component({
  selector: 'app-study-group-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-[calc(100vh-3.5rem)]">
      <div class="max-w-4xl mx-auto px-4 py-8">
        <a routerLink="/study-groups" class="text-sm text-blue-600 hover:underline mb-4 inline-block">
          Terug naar studiegroepen
        </a>

        @if (loading) {
          <p class="text-gray-500">Studiegroep laden...</p>
        } @else if (!group) {
          <div class="bg-white rounded-lg shadow p-8 text-center">
            <p class="text-gray-500">Studiegroep niet gevonden.</p>
          </div>
        } @else {
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <div class="flex items-start justify-between mb-2">
              <h1 class="text-2xl font-bold text-gray-900">{{ group.title }}</h1>
              @if (group.isPrivate) {
                <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded shrink-0 ml-3">
                  Prive
                </span>
              }
            </div>

            @if (group.course) {
              <a [routerLink]="['/courses', group.course.id]"
                class="text-sm text-blue-600 hover:underline font-medium mb-4 inline-block">
                {{ group.course.name }}
                <span class="text-gray-400 font-normal">{{ group.course.code }}</span>
              </a>
            }

            <p class="text-gray-700 mb-6">{{ group.description }}</p>

            <div class="flex flex-wrap gap-6 text-sm text-gray-600">
              <div>
                <span class="font-medium text-gray-900">Locatie</span>
                <p>{{ group.meetingLocation }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-900">Max leden</span>
                <p>{{ group.maxMembers }}</p>
              </div>
              @if (group.owner) {
                <div>
                  <span class="font-medium text-gray-900">Eigenaar</span>
                  <p>{{ group.owner.firstName }} {{ group.owner.lastName }}</p>
                </div>
              }
            </div>
          </div>

          @if (group.studySessions && group.studySessions.length > 0) {
            <h2 class="text-lg font-semibold text-gray-900 mb-3">Studiesessies</h2>
            <div class="grid gap-3 sm:grid-cols-2">
              @for (session of group.studySessions; track session.id) {
                <div class="bg-white rounded-lg shadow p-4">
                  <div class="flex items-start justify-between mb-1">
                    <h3 class="font-medium text-gray-900">{{ session.title }}</h3>
                    <span class="text-xs px-2 py-0.5 rounded shrink-0 ml-2"
                      [class]="session.status === 'planned'
                        ? 'bg-blue-100 text-blue-800'
                        : session.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'">
                      {{ session.status }}
                    </span>
                  </div>
                  <div class="flex gap-4 text-xs text-gray-500 mt-2">
                    <span>{{ session.sessionDate | date:'d MMM yyyy' }}</span>
                    <span>{{ session.startTime | date:'HH:mm' }} - {{ session.endTime | date:'HH:mm' }}</span>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="bg-white rounded-lg shadow p-6 text-center">
              <p class="text-gray-500">Er zijn nog geen studiesessies voor deze groep.</p>
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class StudyGroupDetailComponent implements OnInit {
  group: StudyGroup | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private studyGroupService: StudyGroupService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.studyGroupService.findOne(id).subscribe({
      next: (data) => {
        this.group = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
