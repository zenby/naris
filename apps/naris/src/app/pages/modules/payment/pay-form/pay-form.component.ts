import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BusEmitter, MixedBusService } from '@soer/mixed-bus';
import { AuthService, JWTModel } from '@soer/sr-auth';
import { CommandRead, DataStoreService, DtoPack, extractDtoPackFromBus, OK } from '@soer/sr-dto';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

type PendingOrder = {
  id: number;
  amount: number;
  tries: number;
  createdAt: string;
};

type Good = {
  role: string;
  amount: number;
  options: string[];
};

type PeriodicOrder = {
  id: number;
  amount: number;
};

@Component({
  selector: 'soer-pay-form',
  templateUrl: './pay-form.component.html',
  styleUrls: ['./pay-form.component.scss'],
})
export class PayFormComponent {
  public payUrl = '';
  public deadline?: number = undefined;
  public pendingOrders: PendingOrder[] = [];
  public periodicOrders: PeriodicOrder[] = [];
  public goods: Good[] = [];
  public remoteState: {
    status: string;
    messages: string[];
    actions: Array<Record<string, { id: number; role: string }>>;
  } = {
    status: 'loading',
    messages: [],
    actions: [],
  };
  public user: Observable<DtoPack<JWTModel>>;

  constructor(
    @Inject('manifest') private manifestId: BusEmitter,
    private authService: AuthService,
    private bus$: MixedBusService,
    private store$: DataStoreService,
    private router: Router,
    private http: HttpClient
  ) {
    this.user = extractDtoPackFromBus<JWTModel>(this.store$.of(this.manifestId));
    this.user.subscribe((data) => {
      if (data.status === OK) {
        const [userManifest] = data.items;
        if (userManifest.expired) {
          this.deadline = new Date(userManifest.expired).getTime();
        }
        this.checkRemoteStatus();
      }
    });
    this.payUrl = environment.payServiceUrl;
  }

  updateManifest(): void {
    this.remoteState.status = 'loading';
    this.bus$.publish(new CommandRead(this.manifestId));
  }

  checkRemoteStatus(): void {
    this.http
      .get<DtoPack<{ subs: PeriodicOrder[]; goods: Good[]; pending: PendingOrder[] }>>(
        environment.host + '/api/v2/seller/shelf/roles'
      )
      .subscribe((result) => {
        if (result['status'] === OK) {
          this.remoteState.status = 'ok';
          const [shelf] = result.items;
          this.periodicOrders = shelf.subs;
          this.goods = shelf.goods;
          this.pendingOrders = shelf.pending;
        }
      });

    /*this.http.get(environment.host + '/api/v2/seller/status/' + email)
      .subscribe(result => {

        let status = 'ok';
        let messages: string[] = [];
        const actions: any = [];

        if ((result as any)['status'] === 'ok') {
          const payments: { id: number, amount: number, outdated: boolean, status: string, payedAt: number }[] = (result as any).items;
          const pending = payments.filter(p => p.status === 'pending');
          const days30 = new Date().getTime() - 30 * 24 * 3600 * 1000;
          const active = payments.filter(p => p.payedAt > days30 && p.status === 'succeeded');

          if (active.length > 0) {
            status = 'error';
            messages = ['У вас есть уже оплаченные тарифы'];
            actions.push({
              logout: { role: '' }
            })
          } else if(pending.length > 0) {
            status = 'error';



            pending.forEach(item => {
              if (item.outdated) {
                messages = ['Время, отведенное на платеж закончилось.',
                            'Если деньги списаны со счета, то свяжитесь с soersoft@gmail.com'
                ];
              } else {
                messages = ['У вас есть незавершенные платежи'];
                actions.push({
                  continue: { payment: { amount: item.amount || 0, id: item.id } }
                });               
              }
              actions.push({
                delete: { payment: { amount: item.amount || 0, id: item.id } }
              }),
              actions.push({
                renew: { payment: { amount: item.amount || 0, id: item.id } }
              })

            });

          }
        }
        this.remoteState = { status, messages, actions };
      });*/
  }

  deletePayment(id: number): void {
    this.remoteState.status = 'loading';
    this.http.get(environment.host + '/api/v2/seller/cancel/' + id).subscribe(() => {
      this.checkRemoteStatus();
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  renew(id: number): void {
    this.remoteState.status = 'loading';
    this.http.get<{ status: string }>(environment.host + '/api/v2/seller/check/' + id).subscribe((result) => {
      let status = 'error';
      let { messages, actions } = this.remoteState;
      if (result.status === 'succeeded') {
        status = 'error';
        messages = ['У вас есть уже оплаченные тарифы'];
        actions = [
          {
            logout: { id: 0, role: '' },
          },
        ];
      } else {
        messages.push('Результат проверки: платеж не проведен, свяжитесь с поддержкой soersoft@gmail.com');
      }
      this.remoteState = { status, messages, actions };
    });
  }

  cancelSubscription(id: number): void {
    this.remoteState.status = 'loading';
    this.http.delete(environment.host + '/api/v2/seller/subscription/' + id).subscribe(() => {
      this.checkRemoteStatus();
    });
  }

  order(email: string, role: string): void {
    this.http
      .post<DtoPack<Record<string, { id: string }>>>(environment.host + '/api/v2/seller/order', {
        email,
        role,
      })
      .subscribe((result) => {
        if (result.status === OK) {
          if (result.items.length === 1) {
            const [order] = result.items;
            window.location.href = environment.host + '/api/v2/seller/order/' + order['id'];
          }
        }
      });
  }
}
