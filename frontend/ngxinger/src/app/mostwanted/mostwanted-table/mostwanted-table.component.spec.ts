import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MostwantedTableComponent } from './mostwanted-table.component';

describe('MostwantedTableComponent', () => {
  let component: MostwantedTableComponent;
  let fixture: ComponentFixture<MostwantedTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostwantedTableComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostwantedTableComponent);
    component = fixture.componentInstance;
    component.team = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
