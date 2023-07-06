import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JsonEntity } from '../../modules/json/json.entity';
import { Repository } from 'typeorm';
import { ConfigType } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import { JwtConfig } from '../../config/jwt.config';

@Injectable()
export class DocumentAuthGuard implements CanActivate {
  private readonly secret: string;

  constructor(
    @InjectRepository(JsonEntity)
    private readonly jsonRepository: Repository<JsonEntity>,
    @Inject(JwtConfig.KEY) jwtConfig: ConfigType<typeof JwtConfig>
  ) {
    this.secret = jwtConfig.jwtSecret;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return false;
    }

    const [, token] = authorizationHeader.split(' ');
    const documentId = request.params.documentId;
    const documentNamespace = request.params.documentNamespace;

    try {
      const { email } = verify(token, this.secret) as { email: string };

      const count = await this.jsonRepository.count({
        where: {
          author_email: email,
          id: documentId,
          namespace: documentNamespace,
        },
      });

      return count > 0;
    } catch (e) {
      return false;
    }
  }
}
