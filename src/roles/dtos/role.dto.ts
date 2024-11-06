import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @ApiProperty()
  roleId: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description?: string;
}
