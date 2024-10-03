import { ApiProperty } from '@nestjs/swagger';

export class JwtResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresIn: number;
}
