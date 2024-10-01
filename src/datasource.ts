import { DataSource } from 'typeorm';
import { Role } from './entities/role';
import { User } from './entities/user';
import { SessionActivity } from './entities/session-activity';
import { SessionStatus } from './entities/session-status';
import { Session } from './entities/session';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: true,
  entities: [Role, User, SessionActivity, SessionStatus, Session],
  subscribers: [],
  migrations: [],
});
