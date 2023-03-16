import { registerAs } from '@nestjs/config';

export const JwtConfig = registerAs('jwtConfig', () => ({
  jwtSecret: process.env.JWT_SECRET || 'defaultSecretForNarisApi',
}));
