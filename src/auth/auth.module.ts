import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/common/entities/role.entity';
import { SessionActivity } from 'src/common/entities/session-activity.entity';
import { User } from 'src/common/entities/user.entity';
import { SessionStatus } from 'src/common/entities/session-status.entity';
import { AuthService } from './auth.service';
import { CreateSessionPipe } from './create-session.pipe';
import { AuthController } from './auth.controller';
import { Session } from 'src/common/entities/session.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
      }),
    }),
    TypeOrmModule.forFeature([
      User,
      Role,
      Session,
      SessionActivity,
      SessionStatus,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, CreateSessionPipe],
})
export class AuthModule {}
