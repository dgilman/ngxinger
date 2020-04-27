import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeighborhoodMapComponent } from './neighborhood-map.component';

describe('NeighborhoodMapComponent', () => {
  let component: NeighborhoodMapComponent;
  let fixture: ComponentFixture<NeighborhoodMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeighborhoodMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeighborhoodMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
