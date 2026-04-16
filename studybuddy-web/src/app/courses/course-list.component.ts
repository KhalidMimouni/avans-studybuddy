import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from './course.service';
import { Course } from './course.model';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-[calc(100vh-3.5rem)]">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Vakken</h1>

        @if (loading) {
          <p class="text-gray-500">Vakken laden...</p>
        } @else if (courses.length === 0) {
          <div class="bg-white rounded-lg shadow p-8 text-center">
            <p class="text-gray-500">Er zijn nog geen vakken beschikbaar.</p>
          </div>
        } @else {
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            @for (course of courses; track course.id) {
              <a [routerLink]="['/courses', course.id]"
                class="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow block">
                <div class="flex items-start justify-between mb-2">
                  <h2 class="text-lg font-semibold text-gray-900">{{ course.name }}</h2>
                  <span class="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded shrink-0 ml-2">
                    {{ course.code }}
                  </span>
                </div>
                <p class="text-sm text-gray-500 line-clamp-2 mb-3">{{ course.description }}</p>
                <div class="flex gap-4 text-xs text-gray-500">
                  <span>Jaar {{ course.studyYear }}</span>
                  <span>Semester {{ course.semester }}</span>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  loading = true;

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courseService.findAll().subscribe({
      next: (data) => {
        this.courses = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
