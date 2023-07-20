import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BusError, MixedBusService } from '@soer/mixed-bus';
import { FeatureFlagService } from '@soer/sr-feature-flags';
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

type RoutingData = {
  header: {
    title: string;
    subtitle: string;
  };
  controls?: RoutingDataControl[];
};

type RoutingDataControl = {
  icon: string;
  title: string;
  path: string[];
  toggle?: string;
  action?: string;
  featureFlag?: string;
};

/**
 * Базовый компонент включающий:
 * - отображение компонент из роутинга (router-layout)
 * - отображение попап окна с оверлеем
 * - отображение меню
 * - отоюражение мобильного меню
 * */
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
    private readonly featureFlagService: FeatureFlagService
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
    const data = child.snapshot.data as RoutingData;
    this.title = data?.header.title;
    this.subtitle = data?.header.subtitle;

    const { controls } = data;
    if (controls && Array.isArray(controls)) {
      const renderIcon = (ctrl: RoutingDataControl): string => {
        if (ctrl.toggle) {
          const value = child.snapshot.queryParams[ctrl.toggle] === 'true';
          return ctrl.icon.split('/')[value ? 1 : 0] || '';
        }
        return ctrl.icon;
      };

      const controlsMenu = controls
        .filter(
          (ctrl) => ctrl.featureFlag === undefined || this.featureFlagService.isFeatureFlagEnabled(ctrl.featureFlag)
        )
        .map(
          (ctrl) =>
            new MenuControl(ctrl['title'], renderIcon(ctrl), () => {
              const queryParams = { ...child.snapshot.queryParams };
              if (ctrl['action']) {
                queryParams['action'] = ctrl['action'];
                queryParams['startAt'] = Date.now();
              } else {
                delete queryParams['action'];
                delete queryParams['startAt'];
              }
              if (ctrl.toggle) {
                queryParams[ctrl.toggle] = !(child.snapshot.queryParams[ctrl.toggle] === 'true') ? 'true' : undefined;
                if (child.snapshot.queryParams[ctrl.toggle] === 'true') {
                  this.router.navigate(['.'], { relativeTo: child, queryParams });
                  return;
                }
              }
              const extract = (snapshot: ActivatedRouteSnapshot, p = {}): { [key: string]: string | number } => {
                if (snapshot.children) {
                  snapshot.children.forEach((element) => {
                    p = extract(element, p);
                  });
                }
                return { ...p, ...snapshot.params };
              };
              let pathStr = JSON.stringify(ctrl.path);
              const paramsFromRoute = extract(this.route.snapshot);

              Object.keys(paramsFromRoute).forEach((key) => {
                pathStr = pathStr.replace(`:${key}`, paramsFromRoute[key] + '');
              });

              this.router.navigate(JSON.parse(pathStr), { relativeTo: child, queryParams });
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
