import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MapGeometry } from './map-geometry';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapGeometryService {
  private url = '/api/map-geometry';

  constructor(
    private http: HttpClient,
  ) { }

  // XXX I tried HttpParams here but ran into trouble with
  // HttpParamsOptions (which is apparently a private type) is there a better choice than any?
  getMapGeometry(options: any): Observable<MapGeometry> {
    // XXX error handling

    return this.http.get<MapGeometry>(this.url, {
      params: options
    });
  }
}
