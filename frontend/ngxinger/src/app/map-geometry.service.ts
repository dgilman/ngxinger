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

  getMapGeometry(): Observable<MapGeometry> {
    // XXX error handling
    // XXX query string
    return this.http.get<MapGeometry>(this.url);
  }
}
