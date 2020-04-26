import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MostWantedMap } from './mostwanted-map';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MostwantedMapService {
  private url = '/api/mostwanted-map';

  constructor(
    private http: HttpClient,
  ) { }

  getMostWantedMap(): Observable<MostWantedMap[]> {
    // XXX error handling
    return this.http.get<MostWantedMap[]>(this.url);
  }
}
