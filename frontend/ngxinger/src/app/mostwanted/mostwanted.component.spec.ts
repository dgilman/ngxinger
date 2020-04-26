import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostwantedComponent } from './mostwanted.component';

describe('MostwantedComponent', () => {
  let component: MostwantedComponent;
  let fixture: ComponentFixture<MostwantedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostwantedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostwantedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
