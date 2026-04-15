import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, Course, StudyGroup, StudySession, Enrollment } from './entities';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(StudyGroup) private groupRepo: Repository<StudyGroup>,
    @InjectRepository(StudySession) private sessionRepo: Repository<StudySession>,
    @InjectRepository(Enrollment) private enrollmentRepo: Repository<Enrollment>,
  ) {}

  async onApplicationBootstrap() {
    const userCount = await this.userRepo.count();
    if (userCount > 0) {
      this.logger.log('Database already seeded, skipping.');
      return;
    }

    this.logger.log('Seeding database...');
    await this.seed();
    this.logger.log('Database seeded successfully.');
  }

  private async seed() {
    const hash = (pw: string) => bcrypt.hashSync(pw, 10);

    const users = await this.userRepo.save([
      {
        firstName: 'Lisa',
        lastName: 'de Vries',
        email: 'lisa.devries@student.avans.nl',
        passwordHash: hash('Welkom01!'),
        studentNumber: '2145678',
        program: 'Informatica',
      },
      {
        firstName: 'Tom',
        lastName: 'Bakker',
        email: 'tom.bakker@student.avans.nl',
        passwordHash: hash('Welkom02!'),
        studentNumber: '2198765',
        program: 'Informatica',
      },
      {
        firstName: 'Sara',
        lastName: 'Jansen',
        email: 'sara.jansen@student.avans.nl',
        passwordHash: hash('Welkom03!'),
        studentNumber: '2167890',
        program: 'Technische Informatica',
      },
    ]);

    const courses = await this.courseRepo.save([
      {
        name: 'Client-side Web Frameworks',
        code: 'CSWF',
        description:
          'Leer moderne client-side frameworks zoals Angular om interactieve single-page applications te bouwen.',
        studyYear: 2,
        semester: 2,
      },
      {
        name: 'Databases',
        code: 'DB01',
        description:
          'Relationele databases ontwerpen, SQL schrijven en normalisatietechnieken toepassen.',
        studyYear: 1,
        semester: 2,
      },
      {
        name: 'Object Oriented Programming',
        code: 'OOP1',
        description:
          'De basis van objectgeorienteerd programmeren in Java, inclusief klassen, overerving en polymorfisme.',
        studyYear: 1,
        semester: 1,
      },
      {
        name: 'DevOps',
        code: 'DEVP',
        description:
          'CI/CD pipelines, containerisatie met Docker en infrastructuur als code.',
        studyYear: 2,
        semester: 1,
      },
      {
        name: 'Statistiek',
        code: 'STAT',
        description:
          'Beschrijvende en inferentiele statistiek, hypothesetoetsen en regressieanalyse.',
        studyYear: 1,
        semester: 1,
      },
    ]);

    const groups = await this.groupRepo.save([
      {
        title: 'Angular Studiegroep',
        description:
          'Samen werken aan de Angular opdrachten voor CSWF. We helpen elkaar met components, routing en services.',
        meetingLocation: 'Bibliotheek Avans, Stiltezaal',
        maxMembers: 6,
        ownerId: users[0].id,
        courseId: courses[0].id,
      },
      {
        title: 'SQL Oefengroep',
        description:
          'Gezamenlijk SQL queries oefenen en tentamenvragen doorwerken.',
        meetingLocation: 'HA-212',
        maxMembers: 8,
        ownerId: users[1].id,
        courseId: courses[1].id,
      },
      {
        title: 'Java Beginners',
        description:
          'Hulp bij de Java practica. Geschikt voor studenten die moeite hebben met de basis.',
        meetingLocation: 'Online via Teams',
        maxMembers: 10,
        ownerId: users[0].id,
        courseId: courses[2].id,
      },
      {
        title: 'DevOps Lab Partners',
        description:
          'Docker en CI/CD samen uitpluizen. Focus op de praktijkopdrachten.',
        meetingLocation: 'HA-105',
        maxMembers: 4,
        isPrivate: true,
        ownerId: users[2].id,
        courseId: courses[3].id,
      },
    ]);

    const sessions = await this.sessionRepo.save([
      {
        title: 'Angular Routing Verdieping',
        sessionDate: new Date('2026-04-20'),
        startTime: new Date('2026-04-20T14:00:00'),
        endTime: new Date('2026-04-20T16:00:00'),
        status: 'planned',
        notes: 'Neem je laptop mee met een werkend Angular project.',
        studyGroupId: groups[0].id,
      },
      {
        title: 'Angular Forms Workshop',
        sessionDate: new Date('2026-04-22'),
        startTime: new Date('2026-04-22T10:00:00'),
        endTime: new Date('2026-04-22T12:00:00'),
        status: 'planned',
        studyGroupId: groups[0].id,
      },
      {
        title: 'SQL Joins Oefenen',
        sessionDate: new Date('2026-04-20'),
        startTime: new Date('2026-04-20T09:00:00'),
        endTime: new Date('2026-04-20T11:00:00'),
        status: 'planned',
        notes: 'We behandelen INNER, LEFT en RIGHT joins.',
        studyGroupId: groups[1].id,
      },
      {
        title: 'Java Practicum Hulp',
        sessionDate: new Date('2026-04-22'),
        startTime: new Date('2026-04-22T13:00:00'),
        endTime: new Date('2026-04-22T15:00:00'),
        status: 'planned',
        studyGroupId: groups[2].id,
      },
      {
        title: 'Docker Compose Workshop',
        sessionDate: new Date('2026-04-25'),
        startTime: new Date('2026-04-25T10:00:00'),
        endTime: new Date('2026-04-25T12:30:00'),
        status: 'planned',
        notes: 'Installeer Docker Desktop van tevoren.',
        studyGroupId: groups[3].id,
      },
      {
        title: 'Tentamentraining SQL',
        sessionDate: new Date('2026-04-25'),
        startTime: new Date('2026-04-25T14:00:00'),
        endTime: new Date('2026-04-25T16:00:00'),
        status: 'planned',
        studyGroupId: groups[1].id,
      },
    ]);

    await this.enrollmentRepo.save([
      {
        userId: users[1].id,
        studySessionId: sessions[0].id,
        motivation: 'Ik wil Angular routing beter begrijpen.',
      },
      {
        userId: users[2].id,
        studySessionId: sessions[0].id,
        motivation: 'Voorbereiding op het eindproject.',
      },
      {
        userId: users[0].id,
        studySessionId: sessions[2].id,
        motivation: 'SQL joins zijn lastig, extra oefening is welkom.',
      },
      {
        userId: users[2].id,
        studySessionId: sessions[2].id,
      },
      {
        userId: users[1].id,
        studySessionId: sessions[3].id,
        motivation: 'Java is niet mijn sterkste punt.',
      },
      {
        userId: users[0].id,
        studySessionId: sessions[4].id,
        motivation: 'Docker leren voor mijn stage.',
      },
      {
        userId: users[1].id,
        studySessionId: sessions[4].id,
      },
      {
        userId: users[0].id,
        studySessionId: sessions[5].id,
        motivation: 'Laatste kans om SQL te oefenen voor het tentamen.',
      },
    ]);
  }
}
