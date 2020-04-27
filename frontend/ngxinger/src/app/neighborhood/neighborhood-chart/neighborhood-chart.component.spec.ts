import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeighborhoodChartComponent } from './neighborhood-chart.component';

describe('NeighborhoodChartComponent', () => {
  let component: NeighborhoodChartComponent;
  let fixture: ComponentFixture<NeighborhoodChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeighborhoodChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeighborhoodChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
