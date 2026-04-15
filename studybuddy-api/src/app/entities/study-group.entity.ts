import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';
import { StudySession } from './study-session.entity';

@Entity()
export class StudyGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  meetingLocation: string;

  @Column()
  maxMembers: number;

  @Column({ default: false })
  isPrivate: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  ownerId: number;

  @ManyToOne(() => User, (user) => user.studyGroups)
  owner: User;

  @Column()
  courseId: number;

  @ManyToOne(() => Course, (course) => course.studyGroups)
  course: Course;

  @OneToMany(() => StudySession, (session) => session.studyGroup, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  studySessions: StudySession[];
}
