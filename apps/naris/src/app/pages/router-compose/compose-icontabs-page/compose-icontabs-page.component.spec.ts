import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NzMessageModule } from 'ng-zorro-antd/message';

import { ComposeIcontabsPageComponent } from './compose-icontabs-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute } from '@angular/router';
import { faker } from '@faker-js/faker';
import { IconTab } from './compose-icontabs-page.model';

const getMockHeaderData = () => ({
  title: faker.datatype.string(),
  subtitle: faker.datatype.string(),
  icon: faker.datatype.string(),
  iconText: faker.datatype.boolean() ? faker.datatype.string : '',
});

const getMockIconTab = (pathLength = 1): IconTab => ({
  title: faker.datatype.string(),
  icon: faker.datatype.string(),
  path: Array.from({ length: pathLength }).map(() => faker.datatype.string()),
  iconText: faker.datatype.string(),
  componentName: faker.datatype.string(),
});

const getMockRouteConfig = (path: string = '', childrenAmount: number = 2, children = []) => {
  const arrayLength = childrenAmount || faker.datatype.number({ min: 1, max: 10 });
  const generatedChildren = Array.from({ length: arrayLength }).map(() => ({
    path: faker.datatype.string(),
    data: {
      header: getMockHeaderData(),
    },
  }));

  return {
    path: path || faker.datatype.string(),
    children: [...generatedChildren, ...children],
  };
};

class MockNzMessageService {}

describe('ComposeIcontabsPageComponent', () => {
  let component: ComposeIcontabsPageComponent;
  let fixture: ComponentFixture<ComposeIcontabsPageComponent>;

  const componentSetup = () => {
    TestBed.compileComponents();
    fixture = TestBed.createComponent(ComposeIcontabsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NzMessageModule],
      declarations: [ComposeIcontabsPageComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: NzMessageService, useClass: MockNzMessageService }],
    });
  });

  it('should create', () => {
    componentSetup();

    expect(component).toBeTruthy();
  });

  describe('prepareTabs', () => {
    function setup() {
      const routeConfig = getMockRouteConfig();

      TestBed.overrideProvider(ActivatedRoute, {
        useValue: {
          routeConfig,
        },
      });

      componentSetup();

      return routeConfig;
    }

    it('Tabs should be initialized according to ActivatedRoute config', () => {
      const routeConfig = setup();

      const tabs = routeConfig.children.map((child) => ({
        componentName: undefined,
        title: child.data.header.title,
        icon: child.data.header.icon,
        iconText: child.data.header.iconText,
        path: [child.path],
      }));

      expect(component.tabs).toEqual(tabs);
    });
  });

  describe('activateTab', () => {
    it('active$ should contain null when route children is empty', () => {
      component.active$.subscribe((active) => {
        expect(active).toEqual(null);
      });
    });
  });

  describe('isTabDisabled', () => {
    it('Should return false if activeTab path is empty', () => {
      expect(component.isTabDisabled(getMockIconTab(0), getMockIconTab())).toBeFalsy();
    });

    it('Should return false if activeTab path does not match with testing tab', () => {
      expect(component.isTabDisabled(getMockIconTab(), getMockIconTab())).toBeFalsy();
    });

    it('Should return true if activeTab path matches with testing tab', () => {
      const activeTab = getMockIconTab();
      const testingTab = getMockIconTab();
      testingTab.path = activeTab.path.slice();

      expect(component.isTabDisabled(activeTab, testingTab)).toBeTruthy();
    });
  });
});
