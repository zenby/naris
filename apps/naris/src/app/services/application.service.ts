import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BusEmitter } from '@soer/mixed-bus';
import { WebFile } from '@soer/soer-components';
import { AuthService, JWTModel } from '@soer/sr-auth';
import { DataStoreService, DtoPack, extractDtoPackFromBus } from '@soer/sr-dto';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserModel } from './application.models';
import { MAIN_MENU } from './menu/menu.const';
import { IMenuControl } from './menu/menu.interfaces';
import { MenuControl } from './menu/MenuControl.class';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  public control$ = new BehaviorSubject<IMenuControl[]>([]);
  public mainMenu = MAIN_MENU;

  public user: UserModel = { id: -1, role: 'guest', email: '' };
  public user$: Observable<DtoPack<JWTModel>>;
  public loadingFiles: { [key: string]: boolean } = {};

  constructor(
    @Inject('manifest') private manifestId: BusEmitter,
    public auth: AuthService,
    public store$: DataStoreService,
    private http: HttpClient
  ) {
    this.user$ = extractDtoPackFromBus<JWTModel>(this.store$.of(this.manifestId)).pipe(
      tap((dtoPack) => {
        const [jwtModel] = dtoPack.items;
        if (jwtModel) {
          this.user.id = jwtModel.id;
          this.user.email = jwtModel.email;
          this.user.role = jwtModel.role;
        }
      })
    );
  }

  public pageControls(controls: MenuControl[]): void {
    this.control$.next(controls);
  }

  public download(url: string, file: string): void {
    const loadingProgress: boolean | undefined = this.loadingFiles[file];
    if (!loadingProgress) {
      this.loadingFiles[file] = true;
    } else {
      return;
    }

    const newHeaders = (): HttpHeaders => {
      const headers: HttpHeaders = new HttpHeaders();
      const token = this.auth.token;
      if (token) {
        const tokenValue = 'Bearer ' + token;
        headers.set('Authorization', tokenValue);
      }
      return headers;
    };
    this.http.get(url, { headers: newHeaders(), responseType: 'blob' }).subscribe(
      (blob) => {
        this.loadingFiles[file] = false;
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = file;
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
      () => (this.loadingFiles[file] = false)
    );
  }
}
