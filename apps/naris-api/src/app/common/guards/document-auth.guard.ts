import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class DocumentAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const documentId = request.params.id;
    const documentNamespace = request.params.documentNamespace;

    // const authorEmail = request.body.author_email;

    return true;
  }
}
