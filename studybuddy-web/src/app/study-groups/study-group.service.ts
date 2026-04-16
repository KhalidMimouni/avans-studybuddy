import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StudyGroup } from './study-group.model';

@Injectable({ providedIn: 'root' })
export class StudyGroupService {
  constructor(private http: HttpClient) {}

  findAll(filters?: { courseId?: number; search?: string }) {
    let params = new HttpParams();
    if (filters?.courseId) params = params.set('courseId', filters.courseId);
    if (filters?.search) params = params.set('search', filters.search);

    return this.http.get<StudyGroup[]>('/api/study-groups', { params });
  }

  findOne(id: number) {
    return this.http.get<StudyGroup>(`/api/study-groups/${id}`);
  }
}
