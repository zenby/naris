import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import { JwtPayload } from '../types/jwt-payload.interface';
import { JwtConfig } from '../../config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(JwtConfig.KEY) jwtConfig: ConfigType<typeof JwtConfig>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    return payload;
  }
}
