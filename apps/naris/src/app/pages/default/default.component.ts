import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BusError, MixedBusService } from '@soer/mixed-bus';
import { NzBreakpointService, siderResponsiveMap } from 'ng-zorro-antd/core/services';
import { NzSiderComponent } from 'ng-zorro-antd/layout';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Visibility } from '../../api/targets/target.interface';
import { ApplicationService } from '../../services/application.service';
import { IMenuControl } from '../../services/menu/menu.interfaces';
import { MenuControl } from '../../services/menu/MenuControl.class';
import { MAIN_MENU } from './menu.const';

@Component({
  selector: 'soer-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  isMobileView = false;
  controls$ = new BehaviorSubject<IMenuControl[]>([]);
  breakpoint = '';
  title = '';
  subtitle = '';
  subscriptions: Subscription[] = [];
  isShowOverlay = true;
  header: Visibility = {
    pay: true,
    level: true,
    github: true,
    messages: true,
  };

  menuItems = MAIN_MENU;

  constructor(
    public app: ApplicationService,
    private router: Router,
    private route: ActivatedRoute,
    private bus$: MixedBusService,
    private message: NzMessageService,
    private breakpointService: NzBreakpointService,
  ) {}

  ngOnInit(): void {
    this.subscriptions = [
      this.breakpointService.subscribe(siderResponsiveMap).subscribe((size) => {
        this.breakpoint = size;
        this.isMobileView = ['xs', 'sm', 'md', 'lg'].includes(size);
      }),
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(this.findTitle.bind(this)),
      this.bus$.of(BusError).subscribe((errorMessage) => {
        if (errorMessage instanceof BusError) {
          errorMessage.errors.forEach((msg) => this.message.error(msg));
        }
      }),
    ];
    this.findTitle();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  logout(): void {
    this.app.auth.logout();
    this.router.navigate(['login']);
  }

  findTitle(): void {
    const findChildActiveRoute = (nextChild: ActivatedRoute): ActivatedRoute => {
      if (nextChild.children.length > 0) {
        const filteredChildren = nextChild.children.filter((childTmp) => childTmp.outlet === 'primary');
        for (const childTmp of filteredChildren) {
          return findChildActiveRoute(childTmp);
        }
      }
      return nextChild;
    };

    const child = findChildActiveRoute(this.route);

    const data = child.snapshot.data;
    this.title = (data['header'] || {}).title;
    this.subtitle = (data['header'] || {}).subtitle;

    const controls = child.snapshot.data['controls'];
    if (controls && Array.isArray(controls)) {
      const renderIcon = (ctrl: any): string => {
        if (ctrl.toggle) {
          const value = child.snapshot.queryParams[ctrl['toggle']] === 'true';
          return ctrl.icon.split('/')[value ? 1 : 0] || '';
        }
        return ctrl['icon'];
      };
      const controlsMenu = controls.map(
        (ctrl) =>
          new MenuControl(ctrl['title'], renderIcon(ctrl), () => {
            const queryParams = { ...child.snapshot.queryParams };
            if (ctrl['action']) {
              queryParams['action'] = ctrl['action'];
            }

            if (ctrl['toggle']) {
              queryParams[ctrl['toggle']] = !(child.snapshot.queryParams[ctrl['toggle']] === 'true')
                ? 'true'
                : undefined;
            }

            this.router.navigate(ctrl.path, { relativeTo: child, queryParams });
          })
      );
      this.controls$.next(controlsMenu);
    } else {
      this.controls$.next([]);
    }
  }

  check(sider: NzSiderComponent): void {
    if (sider.matchBreakPoint) {
      sider.setCollapsed(true);
    }
  }
}
