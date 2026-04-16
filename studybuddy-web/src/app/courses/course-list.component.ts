import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { CourseService } from './course.service';
import { Course } from './course.model';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="bg-gray-50 min-h-[calc(100vh-3.5rem)]">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Vakken</h1>

        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <div class="grid gap-3 sm:grid-cols-3">
            <div>
              <label for="search" class="block text-xs font-medium text-gray-500 mb-1">Zoeken</label>
              <input
                id="search"
                type="text"
                placeholder="Naam of code..."
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                [ngModel]="searchTerm"
                (ngModelChange)="onSearchChange($event)" />
            </div>
            <div>
              <label for="studyYear" class="block text-xs font-medium text-gray-500 mb-1">Studiejaar</label>
              <select
                id="studyYear"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                [(ngModel)]="selectedStudyYear"
                (ngModelChange)="applyFilters()">
                <option [ngValue]="undefined">Alle jaren</option>
                <option [ngValue]="1">Jaar 1</option>
                <option [ngValue]="2">Jaar 2</option>
                <option [ngValue]="3">Jaar 3</option>
                <option [ngValue]="4">Jaar 4</option>
              </select>
            </div>
            <div>
              <label for="semester" class="block text-xs font-medium text-gray-500 mb-1">Semester</label>
              <select
                id="semester"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                [(ngModel)]="selectedSemester"
                (ngModelChange)="applyFilters()">
                <option [ngValue]="undefined">Alle semesters</option>
                <option [ngValue]="1">Semester 1</option>
                <option [ngValue]="2">Semester 2</option>
              </select>
            </div>
          </div>
          @if (hasActiveFilters()) {
            <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span class="text-xs text-gray-500">{{ filteredCount }} resultaten</span>
              <button
                (click)="clearFilters()"
                class="text-xs text-blue-600 hover:text-blue-800 font-medium">
                Filters wissen
              </button>
            </div>
          }
        </div>

        @if (loading) {
          <p class="text-gray-500">Vakken laden...</p>
        } @else if (courses.length === 0) {
          <div class="bg-white rounded-lg shadow p-8 text-center">
            @if (hasActiveFilters()) {
              <p class="text-gray-500">Geen vakken gevonden met de huidige filters.</p>
            } @else {
              <p class="text-gray-500">Er zijn nog geen vakken beschikbaar.</p>
            }
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
export class CourseListComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  loading = true;
  filteredCount = 0;

  searchTerm = '';
  selectedStudyYear?: number;
  selectedSemester?: number;

  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.search$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.searchTerm = term;
        this.applyFilters();
      });

    this.applyFilters();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(term: string) {
    this.search$.next(term);
  }

  applyFilters() {
    this.loading = true;
    this.courseService
      .findAll({
        studyYear: this.selectedStudyYear,
        semester: this.selectedSemester,
        search: this.searchTerm || undefined,
      })
      .subscribe({
        next: (data) => {
          this.courses = data;
          this.filteredCount = data.length;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  hasActiveFilters(): boolean {
    return !!this.searchTerm || this.selectedStudyYear !== undefined || this.selectedSemester !== undefined;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedStudyYear = undefined;
    this.selectedSemester = undefined;
    this.applyFilters();
  }
}
