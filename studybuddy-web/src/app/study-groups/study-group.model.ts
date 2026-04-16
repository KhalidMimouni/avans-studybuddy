export interface StudyGroupOwner {
  id: number;
  firstName: string;
  lastName: string;
}

export interface StudyGroupCourse {
  id: number;
  name: string;
  code: string;
}

export interface StudyGroupSession {
  id: number;
  title: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string | null;
}

export interface StudyGroup {
  id: number;
  title: string;
  description: string;
  meetingLocation: string;
  maxMembers: number;
  isPrivate: boolean;
  ownerId: number;
  courseId: number;
  createdAt: string;
  updatedAt: string;
  course?: StudyGroupCourse;
  owner?: StudyGroupOwner;
  studySessions?: StudyGroupSession[];
}
