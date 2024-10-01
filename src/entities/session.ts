import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SessionActivity } from './session-activity';
import { SessionStatus } from './session-status';
import { User } from './user';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn({ name: 'session_id' })
  sessionId: number;

  @Column({ name: 'session_token' })
  sessionToken: string;

  @Column({ name: 'ip_address' })
  ipAddress: string | null;

  @Column({ name: 'device_type' })
  deviceType: string | null;

  @Column()
  os: string | null;

  @Column()
  browser: string | null;

  @Column()
  location: string | null;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'last_activity' })
  lastActivity: Date;

  @Column({ name: 'end_time' })
  endTime: Date | null;

  @OneToMany(
    () => SessionActivity,
    (sessionActivity) => sessionActivity.session,
  )
  sessionActivities: SessionActivity[];

  @ManyToOne(() => SessionStatus, (sessionStatus) => sessionStatus.sessions)
  @JoinColumn([{ name: 'status_id', referencedColumnName: 'statusId' }])
  status: SessionStatus;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  user: User;
}
