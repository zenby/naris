import { TestBed, waitForAsync } from '@angular/core/testing';
import { ANY_SERVICE } from '@soer/mixed-bus';
import { AuthService } from '@soer/sr-auth';
import { DataStoreService } from '@soer/sr-dto';

import { ApplicationService } from './application.service';
import { MenuControl } from './menu/MenuControl.class';
import { HttpClient } from '@angular/common/http';

describe('ApplicationService', () => {
  let service: ApplicationService;
  const someTestControl: MenuControl = new MenuControl('title1', 'icon1', () => {
    // empty
  });

  const anotherTestControl = new MenuControl('title2', 'icon2', () => {
    // empty
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            logout: () => {
              // empty
            },
          },
        },
        {
          provide: HttpClient,
          useValue: {},
        },
        DataStoreService,
        { provide: 'manifest', useValue: ANY_SERVICE },
      ],
    });
    service = TestBed.inject(ApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should contain store$, user$, control$, mainMenu', () => {
    expect(service.user).toBeTruthy();
    expect(service.store$).toBeTruthy();
    expect(service.user$).toBeTruthy();
    expect(service.auth).toBeTruthy();
    expect(service.mainMenu).toBeTruthy();
    expect(service.control$).toBeTruthy();
  });

  it('should have menu$ porperty', waitForAsync(() => {
    service.pageControls([someTestControl, anotherTestControl]);

    service.control$.subscribe((menu) => {
      expect(menu).toEqual([someTestControl, anotherTestControl]);
    });
  }));
});
