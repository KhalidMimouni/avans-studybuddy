import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService } from './course.service';
import { Course } from './course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-[calc(100vh-3.5rem)]">
      <div class="max-w-4xl mx-auto px-4 py-8">
        <a routerLink="/courses" class="text-sm text-blue-600 hover:underline mb-4 inline-block">
          Terug naar vakken
        </a>

        @if (loading) {
          <p class="text-gray-500">Vak laden...</p>
        } @else if (!course) {
          <div class="bg-white rounded-lg shadow p-8 text-center">
            <p class="text-gray-500">Vak niet gevonden.</p>
          </div>
        } @else {
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <div class="flex items-start justify-between mb-4">
              <h1 class="text-2xl font-bold text-gray-900">{{ course.name }}</h1>
              <span class="text-sm font-mono bg-gray-100 text-gray-600 px-3 py-1 rounded shrink-0 ml-3">
                {{ course.code }}
              </span>
            </div>

            <p class="text-gray-700 mb-6">{{ course.description }}</p>

            <div class="flex gap-6 text-sm text-gray-600">
              <div>
                <span class="font-medium text-gray-900">Studiejaar</span>
                <p>{{ course.studyYear }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-900">Semester</span>
                <p>{{ course.semester }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-900">Status</span>
                <p>{{ course.isActive ? 'Actief' : 'Inactief' }}</p>
              </div>
            </div>
          </div>

          @if (course.studyGroups && course.studyGroups.length > 0) {
            <h2 class="text-lg font-semibold text-gray-900 mb-3">Studiegroepen</h2>
            <div class="grid gap-3 sm:grid-cols-2">
              @for (group of course.studyGroups; track group.id) {
                <div class="bg-white rounded-lg shadow p-4">
                  <h3 class="font-medium text-gray-900 mb-1">{{ group.title }}</h3>
                  <p class="text-sm text-gray-500 line-clamp-2 mb-2">{{ group.description }}</p>
                  <div class="flex gap-4 text-xs text-gray-500">
                    <span>{{ group.meetingLocation }}</span>
                    <span>Max {{ group.maxMembers }} leden</span>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="bg-white rounded-lg shadow p-6 text-center">
              <p class="text-gray-500">Er zijn nog geen studiegroepen voor dit vak.</p>
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.courseService.findOne(id).subscribe({
      next: (data) => {
        this.course = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
