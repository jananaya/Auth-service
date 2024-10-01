import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Session } from './session';

@Entity('session_activities')
export class SessionActivity {
  @PrimaryGeneratedColumn({ name: 'activity_id' })
  activityId: number;

  @Column()
  action: string | null;

  @Column({ name: 'action_timestamp' })
  actionTimestamp: Date | null;

  @ManyToOne(() => Session, (session) => session.sessionActivities)
  @JoinColumn([{ name: 'session_id', referencedColumnName: 'sessionId' }])
  session: Session;
}
