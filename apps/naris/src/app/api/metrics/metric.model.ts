import { Observable, Subscribable } from 'rxjs';

export interface MetricModel {
  title: string;
  value: Observable<string | number> | Subscribable<string | number> | Promise<string | number>;
  icon: string;
  url: string;
  suffix?: string;
}
