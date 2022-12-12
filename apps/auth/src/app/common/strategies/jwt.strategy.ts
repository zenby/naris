import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Configuration } from '../../config/config';
import { JwtPayload } from '../../auth/jwt-payload.interface';
import { UserEntity } from '../../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      ignoreExpiration: false,
      secretOrKey: configService.get<Configuration['jwt']>('jwt').jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const { id, email } = payload;

    const user = await this.userRepository.findOne({ where: { id, email } });
    // const user = { id, email, login: '', password: '' };

    if (!user) {
      throw new ForbiddenException();
    }
    return user;
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'refresh_token' in req.cookies && req.cookies.refresh_token.length > 0) {
      return req.cookies.refresh_token;
    }

    return null;
  }
}
