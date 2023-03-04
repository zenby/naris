import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VideoModel } from '../streams/stream.model';

@Injectable()
export class WorkshopsService implements Resolve<VideoModel> {
  constructor(private http: HttpClient) {}

  getWorkshops(): Observable<VideoModel> {
    return this.http.get<VideoModel>(`${environment.host}/api/kinescope/workshops`);
    //return this.http.get<any>(environment.assetsUrl + 'workshops.json');
  }
  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<VideoModel> {
    return this.getWorkshops();
  }
}
