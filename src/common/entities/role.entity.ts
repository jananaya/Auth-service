import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn({ name: 'role_id' })
  roleId: number;

  @Column()
  name: string;

  @Column()
  description: string | null;

  @OneToMany(() => User, (user) => user.role)
  user: User[];
}
