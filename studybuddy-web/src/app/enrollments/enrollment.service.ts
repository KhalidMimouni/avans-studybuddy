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

export interface MyEnrollment {
  id: number;
  joinedAt: string;
  attendanceStatus: string;
  studySession: {
    id: number;
    title: string;
    sessionDate: string;
    startTime: string;
    endTime: string;
    status: string;
    studyGroup: {
      id: number;
      title: string;
    };
  };
}

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  constructor(private http: HttpClient) {}

  getMyEnrollments() {
    return this.http.get<MyEnrollment[]>('/api/enrollments/my');
  }

  enroll(studySessionId: number): Observable<Enrollment> {
    return this.http.post<Enrollment>('/api/enrollments', { studySessionId });
  }

  unenroll(studySessionId: number): Observable<void> {
    return this.http.delete<void>(`/api/enrollments/${studySessionId}`);
  }
}
