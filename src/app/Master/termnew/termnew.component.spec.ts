import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermnewComponent } from './termnew.component';

describe('TermnewComponent', () => {
  let component: TermnewComponent;
  let fixture: ComponentFixture<TermnewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermnewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
