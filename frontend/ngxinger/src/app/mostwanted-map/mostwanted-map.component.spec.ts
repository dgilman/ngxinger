import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostwantedMapComponent } from './mostwanted-map.component';

describe('MostwantedMapComponent', () => {
  let component: MostwantedMapComponent;
  let fixture: ComponentFixture<MostwantedMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostwantedMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostwantedMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
