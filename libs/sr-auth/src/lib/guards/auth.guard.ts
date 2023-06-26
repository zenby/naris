import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { switchMap, Observable, of, catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | Observable<boolean | UrlTree> {
    if (this.auth.isAuth) {
      return true;
    } else {
      // Попытка обновить токен
      return this.auth.renewTokenV2().pipe(
        switchMap((result) => {
          if (result.items[0].accessToken) {
            return of(true);
          } else {
            return of(this.router.createUrlTree(['login']));
          }
        }),
        catchError(() => {
          // 401 и 403 нужно отлавливать вручную
          return of(this.router.createUrlTree(['login']));
        })
      );
    }
  }
}
