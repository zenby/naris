import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JsonService } from '../../modules/json/json.service';

@Injectable()
export class DocumentAuthGuard implements CanActivate {
  constructor(private readonly jsonService: JsonService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    if (!user || !user.email) {
      return false;
    }

    const documentId = request.params.documentId;
    const documentNamespace = request.params.documentNamespace;

    return await this.jsonService.any(documentId, documentNamespace, user.email);
  }
}
