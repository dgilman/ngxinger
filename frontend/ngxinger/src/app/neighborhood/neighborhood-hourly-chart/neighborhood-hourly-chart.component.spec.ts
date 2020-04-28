import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NeighborhoodHourlyChartComponent } from './neighborhood-hourly-chart.component';

describe('NeighborhoodHourlyChartComponent', () => {
  let component: NeighborhoodHourlyChartComponent;
  let fixture: ComponentFixture<NeighborhoodHourlyChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeighborhoodHourlyChartComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeighborhoodHourlyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
