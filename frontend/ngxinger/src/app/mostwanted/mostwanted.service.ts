import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MostWanted } from './mostwanted';

@Injectable({
  providedIn: 'root'
})
export class MostWantedService {
  private url = '/api/longest-held';

  constructor(
    private http: HttpClient,
  ) { }

  getMostWanted(team: number): Observable<MostWanted[]> {
    return this.http.get<MostWanted[]>(this.url, {
      params: {
        team: team.toString()
      }
    });
  }
}
