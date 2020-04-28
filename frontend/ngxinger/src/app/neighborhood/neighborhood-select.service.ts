import { Injectable } from '@angular/core';
import { Observable, Subject} from 'rxjs';

import { NeighborhoodSelect } from './neighborhood-select';

@Injectable({
  providedIn: 'root'
})
export class NeighborhoodSelectService {
  private subject = new Subject<NeighborhoodSelect>();

  sendMessage(coord: NeighborhoodSelect) {
    this.subject.next(coord);
  }

  getMessage(): Observable<NeighborhoodSelect> {
    return this.subject.asObservable();
  }
}
