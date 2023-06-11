import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.auth.isAuth) {
      return true;
    } else {
      // Попытка обновить токен
      this.auth
        .renewTokenV2()
        .pipe(
          tap(() => {
            this.router.navigate(['pages']);
          })
        )
        .subscribe();

      this.router.navigate(['login']);
      return false;
    }
  }
}
