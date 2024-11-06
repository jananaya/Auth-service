import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { Repository } from 'typeorm';
import { User } from 'src/common/entities/user.entity';
import { Role as ERole } from '../roles/enums/role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/common/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    private readonly configService: ConfigService,
  ) {}

  /**
   * Handles user registration, creates a new user, and returns the user data.
   *
   * @param {CreateUserDto} user - The user data transfer object containing the username, email, and password.
   * @returns {Promise<UserDto>} Returns a promise resolving to an object containing the user ID, username, and email.
   *
   * @throws {BadRequestException} Throws if the user already exists.
   */
  async create(user: CreateUserDto): Promise<UserDto> {
    const userExists = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username OR user.email = :email', {
        username: user.username,
        email: user.email,
      })
      .getExists();

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const role = await this.roleRepository.findOne({
      where: { roleId: user.roleId },
    });

    if (!role || user.roleId === ERole.ADMIN) {
      throw new BadRequestException('Invalid role');
    }

    const salt = Number(this.configService.get('HASH_SALT'));

    const userEntity = {
      username: user.username,
      email: user.email,
      passwordHash: bcrypt.hashSync(user.password, salt),
      createdAt: new Date(),
      role: { roleId: user.roleId },
    };
    const createdUser = this.userRepository.create(userEntity);

    await this.userRepository.save(createdUser);

    const userDto = {
      userId: createdUser.userId,
      username: createdUser.username,
      email: createdUser.email,
    };

    return userDto;
  }
}
