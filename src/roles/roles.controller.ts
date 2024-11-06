import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleDto } from './dtos/role.dto';

@ApiTags('roles')
@Controller('api/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('available-for-creation')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: RoleDto,
    isArray: true,
  })
  async getRoles(): Promise<RoleDto[]> {
    return this.rolesService.getRoles();
  }
}
