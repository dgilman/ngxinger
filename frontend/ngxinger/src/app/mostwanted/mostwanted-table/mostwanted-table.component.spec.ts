import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostwantedTableComponent } from './mostwanted-table.component';

describe('MostwantedTableComponent', () => {
  let component: MostwantedTableComponent;
  let fixture: ComponentFixture<MostwantedTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostwantedTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostwantedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
