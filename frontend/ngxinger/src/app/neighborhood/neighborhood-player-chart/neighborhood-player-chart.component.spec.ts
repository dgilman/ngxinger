import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NeighborhoodPlayerChartComponent } from './neighborhood-player-chart.component';

describe('NeighborhoodPlayerChartComponent', () => {
  let component: NeighborhoodPlayerChartComponent;
  let fixture: ComponentFixture<NeighborhoodPlayerChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeighborhoodPlayerChartComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeighborhoodPlayerChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
