import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { Repository } from 'typeorm';
import { User } from 'src/common/entities/user.entity';
import { Role } from './enums/role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly configService: ConfigService,
  ) {}

  async create(user: CreateUserDto): Promise<UserDto> {
    const userExists = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: user.username })
      .orWhere('user.email = :email', { email: user.email })
      .getExists();

    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const salt = Number(this.configService.get('HASH_SALT'));

    const userEntity = {
      username: user.username,
      email: user.email,
      passwordHash: bcrypt.hashSync(user.password, salt),
      createdAt: new Date(),
      role: { roleId: Role.USER },
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
