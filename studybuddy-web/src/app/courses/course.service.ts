import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Course } from './course.model';

export interface CreateCoursePayload {
  name: string;
  code: string;
  description: string;
  studyYear: number;
  semester: number;
}

export interface UpdateCoursePayload {
  name?: string;
  code?: string;
  description?: string;
  studyYear?: number;
  semester?: number;
  isActive?: boolean;
}

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

  create(payload: CreateCoursePayload) {
    return this.http.post<Course>('/api/courses', payload);
  }

  update(id: number, payload: UpdateCoursePayload) {
    return this.http.patch<Course>(`/api/courses/${id}`, payload);
  }

  remove(id: number) {
    return this.http.delete<void>(`/api/courses/${id}`);
  }
}
