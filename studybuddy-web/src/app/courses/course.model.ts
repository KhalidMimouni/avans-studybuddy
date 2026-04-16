export interface Course {
  id: number;
  name: string;
  code: string;
  description: string;
  studyYear: number;
  semester: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  studyGroups?: StudyGroup[];
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
}
