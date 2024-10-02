import { ConfigService } from '@nestjs/config';

export const jwtConfig = (configService: ConfigService) => ({
  secret: configService.get<string>('JWT_SECRET'),
  expiration: Number(configService.get<string>('JWT_EXPIRATION')),
  refreshSecret: configService.get<string>('JWT_REFRESH_SECRET'),
  refreshExpiration: Number(
    configService.get<string>('JWT_REFRESH_EXPIRATION'),
  ),
});
