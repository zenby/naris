import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    // TODO: сделать обновление cookie когда грузятся модули, которые могут использовать эти куки
    this.auth.checkCookieAuth();
    return !!this.auth.token || this.router.createUrlTree(['/']);
  }
}
