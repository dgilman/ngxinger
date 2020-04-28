import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NeighborhoodSelect } from '../neighborhood-select';
import { NeighborhoodHour } from './neighborhood-hourly';

@Injectable({
  providedIn: 'root'
})
export class NeighborhoodHourlyService {
  private url = '/api/neighborhood-hourly';

  constructor(
    private http: HttpClient,
  ) { }

  getNeighborhoodHours(neighborhoodSelect: NeighborhoodSelect) {
    return this.http.get<NeighborhoodHour[]>(this.url, {
      params: {
        xmin: neighborhoodSelect.min_x.toString(),
        xmax: neighborhoodSelect.max_x.toString(),
        ymin: neighborhoodSelect.min_y.toString(),
        ymax: neighborhoodSelect.max_y.toString(),
      }
    });
  }
}
