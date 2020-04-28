import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MostWantedService } from './mostwanted.service';

describe('MostWantedService', () => {
  let service: MostWantedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(MostWantedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
