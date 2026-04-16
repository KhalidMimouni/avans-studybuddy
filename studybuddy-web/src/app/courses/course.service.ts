import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Course } from './course.model';

@Injectable({ providedIn: 'root' })
export class CourseService {
  constructor(private http: HttpClient) {}

  findAll(filters?: { studyYear?: number; semester?: number; search?: string }) {
    let params = new HttpParams();
    if (filters?.studyYear) params = params.set('studyYear', filters.studyYear);
    if (filters?.semester) params = params.set('semester', filters.semester);
    if (filters?.search) params = params.set('search', filters.search);

    return this.http.get<Course[]>('/api/courses', { params });
  }

  findOne(id: number) {
    return this.http.get<Course>(`/api/courses/${id}`);
  }
}
