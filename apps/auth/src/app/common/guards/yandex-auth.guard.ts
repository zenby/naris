import { ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class YandexAuthGuard extends AuthGuard('yandex') {
    async canActivate(context: ExecutionContext) {
        const activate = (await super.canActivate(context)) as boolean;
        return activate;  
    }

    
    handleRequest(err, user) {
        if (err || !user) {
            throw err || new ForbiddenException();
        }
        return user;
    }
}