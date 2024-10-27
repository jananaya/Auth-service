import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/common/entities/user.entity';
import { Session } from 'src/common/entities/session.entity';
import { SessionActivity } from 'src/common/entities/session-activity.entity';
import { LoginDto } from './dtos/login.dto';
import { CreateSessionType } from './create-session.interface';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { jwtConfig } from 'src/config/jwt.config';
import { JwtConfig } from 'src/config/interfaces/jwt-config.interface';
import { SessionStatus } from './enums/session-status.enum';
import { JwtResponseDto } from './dtos/jwt-response.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly jwtConfig: JwtConfig;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,

    private readonly sessionActivityRepository: Repository<SessionActivity>,

    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,
  ) {
    this.jwtConfig = jwtConfig(this.configService);
  }

  /**
   * Handles user login, verifies credentials, creates a session, and returns JWT tokens.
   *
   * @param {LoginDto} loginDto - The login data transfer object containing the username/email and password.
   * @param {CreateSessionType} createSessionType - Data required to create a session, such as device, location, etc.
   * @returns {Promise<JwtResponseDto>} Returns a promise resolving to an object containing the access token,
   * refresh token, and expiration time.
   *
   * @throws {UnauthorizedException} Throws if the user is not found or if the password is incorrect.
   */
  async login(
    loginDto: LoginDto,
    createSessionType: CreateSessionType,
  ): Promise<JwtResponseDto> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username OR user.email = :email', {
        username: loginDto.username,
        email: loginDto.username,
      })
      .innerJoinAndSelect('user.role', 'role')
      .getOne();

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const sessionEntity = this.sessionRepository.create({
      ...createSessionType,
      user,
      sessionToken: '',
      startTime: new Date(),
      lastActivity: new Date(),
      status: { statusId: SessionStatus.OPEN },
    });

    const session = await this.sessionRepository.save(sessionEntity);

    const payload = {
      userId: user.userId,
      username: user.username,
      role: user.role.name,
      sessionId: session.sessionId,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.secret,
      expiresIn: this.jwtConfig.expiration,
    });

    await this.sessionRepository.update(session.sessionId, {
      sessionToken: accessToken,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.refreshSecret,
      expiresIn: this.jwtConfig.refreshExpiration,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.jwtConfig.expiration,
    };
  }

  /**
   * Handles user logout and invalidates the session by setting the session status to CLOSED.
   *
   * @param {number} sessionId - The ID of the session to invalidate.
   * @param {number} userId - The ID of the user to whom the session belongs.
   * @returns {Promise<void>} Returns a promise that resolves when the session is invalidated.
   *
   * @throws {UnauthorizedException} Throws if the session is not found.
   * @throws {UnauthorizedException} Throws if the session is already closed.
   */
  async logout(sessionId: number, userId: number): Promise<void> {
    const session = await this.sessionRepository
      .createQueryBuilder('session')
      .where(
        'session.sessionId = :sessionId AND session.user.userId = :userId',
        {
          sessionId,
          userId,
        },
      )
      .innerJoin('session.user', 'user')
      .innerJoinAndSelect('session.status', 'status')
      .getOne();

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    if (session.status.statusId === SessionStatus.CLOSED) {
      throw new UnauthorizedException('Session already closed');
    }
    const logoutTime = new Date();

    await this.sessionRepository.update(sessionId, {
      status: { statusId: SessionStatus.CLOSED },
      lastActivity: logoutTime,
      endTime: logoutTime,
    });

    const sessionActivity = this.sessionActivityRepository.create({
      action: 'LOGOUT',
      actionTimestamp: logoutTime,
      session,
    });

    await this.sessionActivityRepository.save(sessionActivity);
  }
}
