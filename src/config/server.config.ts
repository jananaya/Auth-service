export const serverConfig = {
  port: parseInt(process.env.PORT) || 3000,
  allowedOrigins: process.env.ALLOWED_ORIGINS.split(','),
};
