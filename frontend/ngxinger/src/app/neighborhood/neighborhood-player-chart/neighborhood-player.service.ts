import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NeighborhoodSelect } from '../neighborhood-select';
import { NeighborhoodPlayer } from './neighborhood-player';

@Injectable({
  providedIn: 'root'
})
export class NeighborhoodPlayerService {
  private url = '/api/neighborhood-players';

  constructor(
    private http: HttpClient,
  ) { }

  getNeighborhoodPlayers(neighborhoodSelect: NeighborhoodSelect) {
    return this.http.get<NeighborhoodPlayer[]>(this.url, {
      params: {
        xmin: neighborhoodSelect.min_x.toString(),
        xmax: neighborhoodSelect.max_x.toString(),
        ymin: neighborhoodSelect.min_y.toString(),
        ymax: neighborhoodSelect.max_y.toString(),
    }})
  }
}
