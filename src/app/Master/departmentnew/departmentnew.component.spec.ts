import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentnewComponent } from './departmentnew.component';

describe('DepartmentnewComponent', () => {
  let component: DepartmentnewComponent;
  let fixture: ComponentFixture<DepartmentnewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentnewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
