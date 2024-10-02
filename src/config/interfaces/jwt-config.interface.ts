export interface JwtConfig {
  secret: string;
  expiration: number;
  refreshSecret: string;
  refreshExpiration: number;
}
