import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;
}
