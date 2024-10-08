import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class ByRoutePathResolver<T> implements Resolve<T> {
  constructor(private http: HttpClient) {}

  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<T> {
    const path = route.routeConfig?.path || 'overview';
    return this.http.get<T>(`${environment.assetsUrl}${path}.json`);
  }
}
