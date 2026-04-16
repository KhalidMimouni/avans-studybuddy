import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Enrollment {
  id: number;
  joinedAt: string;
  attendanceStatus: string;
  motivation: string | null;
  userId: number;
  studySessionId: number;
}

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  constructor(private http: HttpClient) {}

  enroll(studySessionId: number): Observable<Enrollment> {
    return this.http.post<Enrollment>('/api/enrollments', { studySessionId });
  }

  unenroll(studySessionId: number): Observable<void> {
    return this.http.delete<void>(`/api/enrollments/${studySessionId}`);
  }
}
