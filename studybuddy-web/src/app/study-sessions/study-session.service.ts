import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StudySession } from './study-session.model';

@Injectable({ providedIn: 'root' })
export class StudySessionService {
  constructor(private http: HttpClient) {}

  findAll(filters?: { studyGroupId?: number; date?: string; search?: string }) {
    let params = new HttpParams();
    if (filters?.studyGroupId) params = params.set('studyGroupId', filters.studyGroupId);
    if (filters?.date) params = params.set('date', filters.date);
    if (filters?.search) params = params.set('search', filters.search);

    return this.http.get<StudySession[]>('/api/study-sessions', { params });
  }

  findOne(id: number) {
    return this.http.get<StudySession>(`/api/study-sessions/${id}`);
  }
}
