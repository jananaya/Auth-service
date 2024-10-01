import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Session } from './session';

@Entity('session_statuses')
export class SessionStatus {
  @PrimaryGeneratedColumn({ name: 'status_id' })
  statusId: number;

  @Column()
  name: string;

  @Column()
  description: string | null;

  @OneToMany(() => Session, (session) => session.status)
  sessions: Session[];
}
