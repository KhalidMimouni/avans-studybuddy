import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { StudyGroup } from './study-group.entity';
import { Enrollment } from './enrollment.entity';

@Entity()
export class StudySession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  sessionDate: Date;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ default: 'planned' })
  status: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  studyGroupId: number;

  @ManyToOne(() => StudyGroup, (group) => group.studySessions, {
    onDelete: 'CASCADE',
  })
  studyGroup: StudyGroup;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.studySession, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  enrollments: Enrollment[];
}
