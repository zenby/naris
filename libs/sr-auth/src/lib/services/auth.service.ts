import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MixedBusService } from '@soer/mixed-bus';
import { ChangeDataEvent, DtoPack, OK } from '@soer/sr-dto';
import { LocalStorageService } from '@soer/sr-local-storage';
import { BehaviorSubject, firstValueFrom, Observable, tap } from 'rxjs';
import { AuthEmitter } from '../interfaces/auth-options.interface';
import { EmptyJWTModel, JWTModel } from '../interfaces/jwt.models';
import { FeatureFlagService, FeatureFlag } from '@soer/sr-feature-flags';

const TOKEN_KEY = 'tokenV2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  static cookieCheck = false;

  public tokenUpdate$ = new BehaviorSubject<string | null>(null);

  private decodedJSON = EmptyJWTModel;

  private _token: string | null = '';

  constructor(
    @Inject('AuthServiceConfig') private options: AuthEmitter,
    private bus$: MixedBusService,
    private http: HttpClient,
    private featureFlags: FeatureFlagService,
    private localStorageService: LocalStorageService
  ) {
    this.checkIsAuth();
  }

  public get isAuth(): boolean {
    return this.checkIsAuth();
  }

  public get token(): string | null {
    return this._token;
  }

  public set token(n: string | null) {
    this._token = n;

    n !== null ? this.localStorageService.setValue(TOKEN_KEY, n) : this.localStorageService.removeValue(TOKEN_KEY);

    this.decodeJWT(n);
    this.tokenUpdate$.next(n);

    this.bus$.publish(new ChangeDataEvent(this.options, { status: OK, items: [this.extractAndParseJWT(n)] }));
  }

  public updateToken(token: string): void {
    this.localStorageService.setValue(TOKEN_KEY, token);
  }

  private checkIsAuth(): boolean {
    const token: string | null = this.localStorageService.getValue(TOKEN_KEY);
    this.token = this.isTokenValid(token) ? token : null;
    return this.token ? true : false;
  }

  private isTokenValid(token: string | null): boolean {
    return token ? !this.isTokenExpired(token) : false;
  }

  private isTokenExpired(token: string): boolean {
    const expiry: number = JSON.parse(atob(token.split('.')[1])).exp;

    return Date.now() > expiry * 1000;
  }

  logout(): void {
    this.token = null;
  }

  checkCookieAuth() {
    if (this.token && this.options.schema.cookieApi) {
      if (this.featureFlags.isFeatureFlagEnabled(FeatureFlag.auth_v2)) {
        console.error('Auth V2 does not support cookie renew method, remove it when auth_v1 will completle removed.');
        return;
      }

      this.http.get(this.options.schema.cookieApi).subscribe(() => {
        console.log('Cookie renew for auth_v1 method');
      });
    }
  }

  renewToken(): Observable<{ accessToken: string }> {
    return this.http
      .get<{ accessToken: string }>(this.options.schema.renewApi)
      .pipe(tap((result) => (this.token = result.accessToken)));
  }

  renewTokenV2(): Observable<DtoPack<{ accessToken: string }>> {
    return this.http
      .get<DtoPack<{ accessToken: string }>>(this.options.schema.renewApi, {
        withCredentials: true,
        params: { skipAuth: true },
      })
      .pipe(
        tap((result) => {
          if (result.status === OK) {
            const [{ accessToken }] = result.items;
            this.token = accessToken;
          }
        })
      );
  }

  extractAndParseJWT(jwt: string | null): JWTModel | null {
    if (jwt === null) {
      return null;
    }
    try {
      const base64Url = jwt.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const result = JSON.parse(atob(base64));
      return result as JWTModel;
    } catch (err) {
      // do nothing
    }
    return null;
  }

  decodeJWT(jwt: string | null): void {
    this.decodedJSON = this.extractAndParseJWT(jwt) || EmptyJWTModel;
  }

  getEmail(): string {
    if (this.decodedJSON.id === -1) {
      this.decodeJWT(this.token);
    }
    return this.decodedJSON.email;
  }

  getRole(): string {
    if (this.decodedJSON.id === -1) {
      this.decodeJWT(this.token);
    }
    return this.decodedJSON.role.toUpperCase();
  }

  getAuthUrlFor(provider: 'google' | 'yandex'): string {
    return this.options.schema.authApi + provider;
  }

  async processAuth(): Promise<{ accessToken: string } | null> {
    if (this.featureFlags.isFeatureFlagEnabled(FeatureFlag.api_v2)) {
      return this.processAuthV2();
    }
    return null;
  }

  private async processAuthV2(): Promise<{ accessToken: string } | null> {
    const result = await firstValueFrom(this.renewTokenV2());
    if (result.status === OK) {
      const [{ accessToken }] = result.items;
      return { accessToken };
    }
    return null;
  }
}
