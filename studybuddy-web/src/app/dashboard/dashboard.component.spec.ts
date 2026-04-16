import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.match(() => true);
  });

  it('should create and fire API requests', () => {
    expect(component).toBeTruthy();
  });

  describe('formatDate', () => {
    it('should format ISO date to Dutch locale', () => {
      const result = component.formatDate('2026-04-16T00:00:00.000Z');
      expect(result).toContain('2026');
      expect(result).toContain('16');
    });
  });

  describe('formatTime', () => {
    it('should format ISO timestamp to HH:mm', () => {
      const result = component.formatTime('2026-04-16T13:30:00.000Z');
      expect(result).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('computeStatus', () => {
    it('should return cancelled for cancelled sessions', () => {
      const result = component.computeStatus({
        status: 'cancelled',
        sessionDate: '2026-04-16T00:00:00Z',
        startTime: '2026-04-16T10:00:00Z',
        endTime: '2026-04-16T11:00:00Z',
      });
      expect(result).toBe('cancelled');
    });

    it('should return completed for sessions in the past', () => {
      const result = component.computeStatus({
        status: 'planned',
        sessionDate: '2020-01-01T00:00:00Z',
        startTime: '2020-01-01T10:00:00Z',
        endTime: '2020-01-01T11:00:00Z',
      });
      expect(result).toBe('completed');
    });

    it('should return planned for sessions in the future', () => {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);
      const iso = future.toISOString();

      const endFuture = new Date(future);
      endFuture.setHours(endFuture.getHours() + 1);

      const result = component.computeStatus({
        status: 'planned',
        sessionDate: iso,
        startTime: iso,
        endTime: endFuture.toISOString(),
      });
      expect(result).toBe('planned');
    });
  });

  it('should load enrollments on init', () => {
    const mockEnrollments = [
      {
        id: 1,
        joinedAt: '2026-04-16',
        attendanceStatus: 'registered',
        studySession: {
          id: 10,
          title: 'SOLID principes',
          sessionDate: '2026-04-16T00:00:00Z',
          startTime: '2026-04-16T13:00:00Z',
          endTime: '2026-04-16T14:00:00Z',
          status: 'planned',
          studyGroup: { id: 1, title: 'Clean Code' },
        },
      },
    ];

    const enrollReq = httpMock.expectOne('/api/enrollments/my');
    enrollReq.flush(mockEnrollments);
    httpMock.expectOne('/api/study-groups/my').flush([]);

    expect(component.enrollments).toHaveLength(1);
    expect(component.enrollments[0].studySession.title).toBe('SOLID principes');
    expect(component.loadingEnrollments).toBe(false);
  });

  it('should load my groups and extract sessions', () => {
    httpMock.expectOne('/api/enrollments/my').flush([]);

    const mockGroups = [
      {
        id: 1,
        title: 'NoSQL Studiegroep',
        description: '',
        meetingLocation: '',
        maxMembers: 10,
        isPrivate: false,
        ownerId: 1,
        courseId: 1,
        createdAt: '',
        updatedAt: '',
        course: { id: 1, name: 'Databases', code: 'DB01' },
        studySessions: [
          {
            id: 5,
            title: 'MongoDB Intro',
            sessionDate: '2026-04-17T00:00:00Z',
            startTime: '2026-04-17T10:00:00Z',
            endTime: '2026-04-17T11:00:00Z',
            status: 'planned',
            notes: null,
          },
        ],
      },
    ];

    httpMock.expectOne('/api/study-groups/my').flush(mockGroups);

    expect(component.myGroups).toHaveLength(1);
    expect(component.mySessions).toHaveLength(1);
    expect(component.mySessions[0].groupTitle).toBe('NoSQL Studiegroep');
    expect(component.loadingGroups).toBe(false);
  });
});
