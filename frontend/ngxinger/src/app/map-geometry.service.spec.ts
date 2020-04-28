import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MapGeometryService } from './map-geometry.service';

describe('MapGeometryService', () => {
  let service: MapGeometryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(MapGeometryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
