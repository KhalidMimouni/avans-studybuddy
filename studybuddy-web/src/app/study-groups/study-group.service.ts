import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StudyGroup } from './study-group.model';

export interface CreateStudyGroupPayload {
  title: string;
  description: string;
  meetingLocation: string;
  maxMembers: number;
  courseId: number;
}

export interface UpdateStudyGroupPayload {
  title?: string;
  description?: string;
  meetingLocation?: string;
  maxMembers?: number;
  isPrivate?: boolean;
}

@Injectable({ providedIn: 'root' })
export class StudyGroupService {
  constructor(private http: HttpClient) {}

  findMine() {
    return this.http.get<StudyGroup[]>('/api/study-groups/my');
  }

  findAll(filters?: { courseId?: number; studyYear?: number; search?: string }) {
    let params = new HttpParams();
    if (filters?.courseId) params = params.set('courseId', filters.courseId);
    if (filters?.studyYear) params = params.set('studyYear', filters.studyYear);
    if (filters?.search) params = params.set('search', filters.search);

    return this.http.get<StudyGroup[]>('/api/study-groups', { params });
  }

  findOne(id: number) {
    return this.http.get<StudyGroup>(`/api/study-groups/${id}`);
  }

  create(payload: CreateStudyGroupPayload) {
    return this.http.post<StudyGroup>('/api/study-groups', payload);
  }

  update(id: number, payload: UpdateStudyGroupPayload) {
    return this.http.patch<StudyGroup>(`/api/study-groups/${id}`, payload);
  }

  remove(id: number) {
    return this.http.delete<void>(`/api/study-groups/${id}`);
  }
}
