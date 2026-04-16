import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { StudyGroupService } from './study-group.service';
import { StudyGroup } from './study-group.model';
import { CourseService } from '../courses/course.service';
import { Course } from '../courses/course.model';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-study-group-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="bg-gray-50 min-h-[calc(100vh-3.5rem)]">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-900">Studiegroepen</h1>
          @if (auth.isLoggedIn()) {
            <a routerLink="/study-groups/new"
              class="text-sm bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700">
              Nieuwe studiegroep
            </a>
          }
        </div>

        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <div class="grid gap-3 sm:grid-cols-3">
            <div>
              <label for="search" class="block text-xs font-medium text-gray-500 mb-1">Zoeken</label>
              <input
                id="search"
                type="text"
                placeholder="Titel of locatie..."
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                [ngModel]="searchTerm"
                (ngModelChange)="onSearchChange($event)" />
            </div>
            <div>
              <label for="course" class="block text-xs font-medium text-gray-500 mb-1">Vak</label>
              <select
                id="course"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                [(ngModel)]="selectedCourseId"
                (ngModelChange)="applyFilters()">
                <option [ngValue]="undefined">Alle vakken</option>
                @for (course of courses; track course.id) {
                  <option [ngValue]="course.id">{{ course.name }} ({{ course.code }})</option>
                }
              </select>
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
          <p class="text-gray-500">Studiegroepen laden...</p>
        } @else if (groups.length === 0) {
          <div class="bg-white rounded-lg shadow p-8 text-center">
            @if (hasActiveFilters()) {
              <p class="text-gray-500">Geen studiegroepen gevonden met de huidige filters.</p>
            } @else {
              <p class="text-gray-500">Er zijn nog geen studiegroepen beschikbaar.</p>
            }
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
export class StudyGroupListComponent implements OnInit, OnDestroy {
  groups: StudyGroup[] = [];
  courses: Course[] = [];
  loading = true;
  filteredCount = 0;

  searchTerm = '';
  selectedCourseId?: number;
  selectedStudyYear?: number;

  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private studyGroupService: StudyGroupService,
    private courseService: CourseService,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    this.courseService.findAll().subscribe((data) => (this.courses = data));

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
    this.studyGroupService
      .findAll({
        courseId: this.selectedCourseId,
        studyYear: this.selectedStudyYear,
        search: this.searchTerm || undefined,
      })
      .subscribe({
        next: (data) => {
          this.groups = data;
          this.filteredCount = data.length;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  hasActiveFilters(): boolean {
    return !!this.searchTerm || this.selectedCourseId !== undefined || this.selectedStudyYear !== undefined;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCourseId = undefined;
    this.selectedStudyYear = undefined;
    this.applyFilters();
  }
}
