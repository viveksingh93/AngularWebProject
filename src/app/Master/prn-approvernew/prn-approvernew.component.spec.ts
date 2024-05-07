import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrnApprovernewComponent } from './prn-approvernew.component';

describe('PrnApprovernewComponent', () => {
  let component: PrnApprovernewComponent;
  let fixture: ComponentFixture<PrnApprovernewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrnApprovernewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrnApprovernewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
