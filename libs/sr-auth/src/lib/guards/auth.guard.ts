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
            const urlTree = this.router.createUrlTree(['pages']);
            this.router.navigateByUrl(urlTree);
          })
        )
        .subscribe();

      return this.router.createUrlTree(['/', 'login']);
    }
  }
}
