import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Course, StudyGroup, StudySession, Enrollment } from './entities';
import { SeedService } from './seed.service';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { StudyGroupsModule } from './study-groups/study-groups.module';
import { StudySessionsModule } from './study-sessions/study-sessions.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';

const entities = [User, Course, StudyGroup, StudySession, Enrollment];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'studybuddy.db',
      entities,
      synchronize: true,
    }),
    TypeOrmModule.forFeature(entities),
    AuthModule,
    CoursesModule,
    StudyGroupsModule,
    StudySessionsModule,
    EnrollmentsModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
