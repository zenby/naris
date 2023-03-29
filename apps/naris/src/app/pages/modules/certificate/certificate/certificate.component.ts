import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { BusEmitter } from '@soer/mixed-bus';
import { Role } from '@soer/soer-components';
import { AuthService, JWTModel } from '@soer/sr-auth';
import { DataStoreService, DtoPack, extractDtoPackFromBus } from '@soer/sr-dto';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

type CertificateStatus = 'pending' | 'new' | 'undefined' | 'inuse' | 'succeeded';

type Certificate = {
  role: Role;
  status: CertificateStatus;
  exp: Date;
};

@Component({
  selector: 'soer-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss'],
})
export class CertificateComponent {
  public certUrl = '';

  public hasCert = false;
  public certText = '';
  public certObject: Certificate | null = null;
  public user$: Observable<DtoPack<JWTModel>>;

  constructor(
    @Inject('manifest') private manifestId: BusEmitter,
    private authService: AuthService,
    private store$: DataStoreService,
    private http: HttpClient
  ) {
    this.user$ = extractDtoPackFromBus<JWTModel>(this.store$.of(this.manifestId));
  }

  useCert(email: string): void {
    this.http
      .get<{ status: CertificateStatus }>(
        environment.host + '/api/v2/seller/prepaid/' + email + '/' + this.getClearedCertText()
      )
      .subscribe((result) => this.setCertificateStatus(result.status));
  }

  certinfo(): void {
    const cert = this.authService.extractAndParseJWT(this.getClearedCertText());
    if (cert && cert.role) {
      this.certObject = {
        role: cert.role,
        status: 'pending',
        exp: new Date(cert.exp * 1000),
      };

      this.http
        .get<{ status: CertificateStatus }>(
          environment.host + '/api/v2/seller/prepaid_status/' + this.getClearedCertText()
        )
        .subscribe((result) => this.setCertificateStatus(result.status));
    }
  }

  private setCertificateStatus(status: CertificateStatus): void {
    if (this.certObject) {
      this.certObject.status = status;
    }
  }

  private getClearedCertText(): string {
    return this.certText.replace(/[\n\r\s]*/g, '');
  }
}
