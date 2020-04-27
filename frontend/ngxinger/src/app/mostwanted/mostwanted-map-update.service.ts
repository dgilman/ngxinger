import { Injectable } from '@angular/core';
import { Observable,Subject} from 'rxjs';
import { Coordinate } from 'ol/coordinate';

@Injectable({
  providedIn: 'root'
})
export class MostWantedMapUpdateService {
  private subject = new Subject<Coordinate>();

  sendMessage(coord: Coordinate) {
    this.subject.next(coord);
  }

  getMessage(): Observable<Coordinate> {
    return this.subject.asObservable();
  }
}
