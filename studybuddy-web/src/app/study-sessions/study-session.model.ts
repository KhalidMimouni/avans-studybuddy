export interface StudySessionGroup {
  id: number;
  title: string;
  meetingLocation: string;
  maxMembers: number;
  owner?: StudySessionGroupOwner;
}

export interface StudySessionGroupOwner {
  id: number;
  firstName: string;
  lastName: string;
}

export interface StudySessionEnrollment {
  id: number;
  joinedAt: string;
  attendanceStatus: string;
  motivation: string | null;
  user: StudySessionEnrollmentUser;
}

export interface StudySessionEnrollmentUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface StudySession {
  id: number;
  title: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string | null;
  studyGroupId: number;
  createdAt: string;
  updatedAt: string;
  studyGroup?: StudySessionGroup;
  enrollments?: StudySessionEnrollment[];
}
