import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { StudySession } from './study-session.entity';

@Entity()
@Unique(['userId', 'studySessionId'])
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  joinedAt: Date;

  @Column({ default: 'registered' })
  attendanceStatus: string;

  @Column({ nullable: true })
  motivation: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.enrollments)
  user: User;

  @Column()
  studySessionId: number;

  @ManyToOne(() => StudySession, (session) => session.enrollments, {
    onDelete: 'CASCADE',
  })
  studySession: StudySession;
}
