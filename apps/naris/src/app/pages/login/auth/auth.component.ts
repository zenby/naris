import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@soer/sr-auth';

@Component({
  selector: 'soer-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  private jwt: string | null = null;
  constructor(private route: ActivatedRoute, private router: Router, private readonly authService: AuthService) {}

  ngOnInit(): void {
    //    this.jwt = this.route.snapshot.queryParams?.['jwt'] ?? null;
    //    this.checkJWT(this.jwt);
    this.authService.processAuth().then(() => {
      this.redirect();
    });
  }

  checkJWT(token: string | null): void {
    if (token) {
      this.jwt = token;
      this.authService.updateToken(this.jwt);
    }
    //    this.redirect();
  }

  redirect(): void {
    if (this.authService.isAuth) {
      this.router.navigate(['pages']);
      return;
    }
    this.router.navigate(['login']);
  }
}
