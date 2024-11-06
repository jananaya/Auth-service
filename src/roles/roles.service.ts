import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/common/entities/role.entity';
import { Role as ERole } from 'src/roles/enums/role.enum';
import { Repository } from 'typeorm';
import { RoleDto } from './dtos/role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
  ) {}

  async getRoles(): Promise<RoleDto[]> {
    const roles = await this.rolesRepository
      .createQueryBuilder('role')
      .where('role.roleId <> :roleId', { roleId: ERole.ADMIN })
      .getMany();

    return roles.map((role) => this.mapRoleToDto(role));
  }

  private mapRoleToDto(role: Role): RoleDto {
    const { roleId, name, description } = role;

    return {
      roleId,
      name,
      description,
    };
  }
}
